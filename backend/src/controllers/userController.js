import {
  updateUserProfile,
  findUserById,
  getResumeById,
  updateUserResume,
  isCloseFriendOfUser,
  getVisibleCardsForViewer,
} from "../models/usermodel.js";
import { searchUsersByUsername } from "../models/usermodel.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "node:stream";
/*
GET CURRENT USER
*/
export const getCurrentUser = async (req, res) => {

  try {

    const user = await findUserById(req.user.user_id);

    res.json(user);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });

  }

};


/*
UPDATE PROFILE
*/
export const updateProfile = async (req, res) => {

  try {

    const updatedUser = await updateUserProfile(
      req.user.user_id,
      req.body
    );

    res.json(updatedUser);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });

  }

};

export const searchUsers = async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) return res.json([]);

    const users = await searchUsersByUsername(q);

    res.json(users);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Search failed" });

  }

};

export const getUserById = async (req, res) => {

  try {

    const targetUserId = Number(req.params.id);
    const viewerUserId = Number(req.user.user_id);

    const user = await findUserById(targetUserId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = targetUserId === viewerUserId;

    if (!isOwner) {
      return res.json({
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        joined_at: user.joined_at,
        friends_count: user.friends_count,
        close_friends_count: user.close_friends_count,
      });
    }

    res.json(user);

  } catch (err) {

    console.error(`[API] Error fetching user ${req.params.id}:`, err);
    res.status(500).json({ message: "Failed to fetch user" });

  }

};

/*
GET RESUME BY ID (separate endpoint for lazy loading)
*/
export const getResume = async (req, res) => {

  try {

    const resume = await getResumeById(req.params.id);

    res.json({ resume });

  } catch (err) {

    console.error(`[API] Error fetching resume ${req.params.id}:`, err);
    res.status(500).json({ message: "Failed to fetch resume" });

  }

};

export const getHomeVisibility = async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);
    const viewerUserId = Number(req.user.user_id);

    const targetUser = await findUserById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = targetUserId === viewerUserId;
    const isCloseFriend = isOwner ? true : await isCloseFriendOfUser(targetUserId, viewerUserId);

    res.json({
      user: {
        user_id: targetUser.user_id,
        username: targetUser.username,
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
      },
      isOwner,
      isCloseFriend,
      canEdit: isOwner,
      visibleCards: getVisibleCardsForViewer(isOwner, isCloseFriend),
    });
  } catch (err) {
    console.error("[API] Error resolving home visibility:", err);
    res.status(500).json({ message: "Failed to resolve home visibility" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const owner = await findUserById(req.user.user_id);
    const baseName = [owner?.first_name, owner?.last_name]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(" ") || String(owner?.username || `user_${req.user.user_id}`);

    const safeBaseName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `user-${req.user.user_id}`;

    const resumePublicId = `${safeBaseName}-resume-${Date.now()}`;

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sonus/resumes",
          public_id: resumePublicId,
          resource_type: "raw",
          type: "upload",
          access_mode: "public",
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const updated = await updateUserResume(req.user.user_id, uploaded.secure_url);

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: updated.resume,
    });
  } catch (err) {
    console.error("[API] Error uploading resume:", err);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const getResumeFile = async (req, res) => {
  try {
    const resumeUrl = await getResumeById(req.params.id);

    if (!resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const sourceCandidates = [];
    const cloudinaryMatch = String(resumeUrl).match(/\/upload\/(?:v(\d+)\/)?(.+?)\.pdf(?:\?.*)?$/i);

    if (cloudinaryMatch?.[2]) {
      const version = cloudinaryMatch[1] ? Number(cloudinaryMatch[1]) : undefined;
      const publicIdWithoutExt = decodeURIComponent(cloudinaryMatch[2]);
      const rawPublicId = `${publicIdWithoutExt}.pdf`;

      // Download URL fallback for restricted resources.
      sourceCandidates.push(
        cloudinary.utils.private_download_url(rawPublicId, undefined, {
          resource_type: "raw",
          type: "upload",
          expires_at: Math.floor(Date.now() / 1000) + 120,
        })
      );

      // Signed delivery URL for raw/upload assets.
      sourceCandidates.push(
        cloudinary.url(rawPublicId, {
          resource_type: "raw",
          type: "upload",
          secure: true,
          sign_url: true,
          ...(version ? { version } : {}),
        })
      );
    }

    // Last fallback: try the persisted URL as-is.
    sourceCandidates.push(resumeUrl);

    let response = null;

    for (const candidate of sourceCandidates) {
      try {
        const current = await fetch(candidate);
        if (current.ok) {
          response = current;
          break;
        }
      } catch (fetchErr) {
        // Continue with next candidate.
      }
    }

    if (!response) {
      return res.status(400).json({ message: "Unable to load resume preview from storage" });
    }

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
    res.setHeader("Cache-Control", "private, max-age=300");

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
      return;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return res.send(bytes);
  } catch (err) {
    console.error("[API] Error loading resume file:", err);
    return res.status(500).json({ message: "Failed to load resume preview" });
  }
};

export const getResumePreviewUrl = async (req, res) => {
  try {
    const resumeUrl = await getResumeById(req.params.id);

    if (!resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const cloudinaryMatch = String(resumeUrl).match(/\/upload\/(?:v(\d+)\/)?(.+?)\.pdf(?:\?.*)?$/i);

    if (!cloudinaryMatch?.[2]) {
      return res.json({ previewUrl: resumeUrl });
    }

    const publicIdWithoutExt = decodeURIComponent(cloudinaryMatch[2]);
    const rawPublicId = `${publicIdWithoutExt}.pdf`;

    const previewUrl = cloudinary.utils.private_download_url(rawPublicId, undefined, {
      resource_type: "raw",
      type: "upload",
      expires_at: Math.floor(Date.now() / 1000) + 300,
      attachment: false,
    });

    return res.json({ previewUrl });
  } catch (err) {
    console.error("[API] Error generating resume preview URL:", err);
    return res.status(500).json({ message: "Failed to generate resume preview URL" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const existingResumeUrl = await getResumeById(req.user.user_id);

    if (!existingResumeUrl) {
      return res.status(404).json({ message: "No resume found to delete" });
    }

    const cloudinaryMatch = String(existingResumeUrl).match(/\/upload\/(?:v\d+\/)?(.+?)\.pdf(?:\?.*)?$/i);

    if (cloudinaryMatch?.[1]) {
      const publicIdWithoutExt = decodeURIComponent(cloudinaryMatch[1]);
      const deleteCandidates = [`${publicIdWithoutExt}.pdf`, publicIdWithoutExt];

      let deletedFromCloudinary = false;
      let lastDeleteError = null;

      for (const candidate of deleteCandidates) {
        try {
          const destroyResult = await cloudinary.uploader.destroy(candidate, {
            resource_type: "raw",
            type: "upload",
            invalidate: true,
          });

          if (destroyResult?.result === "ok" || destroyResult?.result === "not found") {
            deletedFromCloudinary = true;
            break;
          }
        } catch (assetErr) {
          lastDeleteError = assetErr;
        }
      }

      if (!deletedFromCloudinary) {
        console.error("[API] Cloudinary delete failed:", lastDeleteError);
        return res.status(502).json({ message: "Failed to delete resume from cloud storage" });
      }
    }

    await updateUserResume(req.user.user_id, null);

    return res.json({ message: "Resume deleted successfully", resume: null });
  } catch (err) {
    console.error("[API] Error deleting resume:", err);
    return res.status(500).json({ message: "Failed to delete resume" });
  }
};