import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import {
  updateProfile,
  getUserById,
  getUserResume,
  uploadUserResume,
  deleteUserResume,
  getUserResumePreviewUrl,
} from "../../services/userService";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { useParams } from "react-router-dom";
import "../../index.css";
import { Pencil, X, FileText, Eye, Upload, Trash2 } from "lucide-react";

function Profile() {

  const { user, loading, setUser, refreshUser } = useAuth();
  const { id } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);
  const [resumePreviewLoading, setResumePreviewLoading] = useState(false);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [resumeNotice, setResumeNotice] = useState({ type: "", text: "" });
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftUser, setDraftUser] = useState(null);
  
  const isOwnProfile = !id || id === String(user?.user_id);

  useEffect(() => {
    if (!showResumePreview) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowResumePreview(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showResumePreview]);
  
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  /* LOAD PROFILE */
  useEffect(() => {
  
    // For viewing own profile, wait for auth to load
    if (!id && loading) return;
  
    if (!id) {
      setProfile(user);

      if (user?.user_id) {
        getUserResume(user.user_id)
          .then((resumeData) => setResume(resumeData))
          .catch((err) => console.error(err));
      }

      return;
    }
  
    const fetchUser = async () => {
  
      try {
  
        const data = await getUserById(id);
        setProfile(data);
        
        // Lazy load resume after profile loads
        const resumeData = await getUserResume(id);
        setResume(resumeData);
  
      } catch (err) {
  
        console.error(err);
  
      }
  
    };
  
    fetchUser();
  
  }, [id, user, loading]);
  
  // Show full layout while data loads - prevents flash
  if (!profile) {
    return (
      <div className="relative w-full min-h-screen flex flex-col text-white bg-black overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0b0b0d] to-black"></div>
        <div className="pointer-events-none absolute -top-40 -left-40 -z-10 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
        <div className="pointer-events-none absolute top-[40%] -right-40 -z-10 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>
        <Navbar />
        <main className="flex-1"></main>
        <Footer />
      </div>
    );
  }

  const data = editing ? draftUser : profile;

  const handleEdit = () => {

    setDraftUser({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      location: profile.location || "",
      dob: profile.dob || ""
    });

    setEditing(true);

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setDraftUser(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSave = async () => {

    try {

      const updatedUser = await updateProfile({
        ...draftUser,
        dob: draftUser.dob === "" ? null : draftUser.dob
      });

      setUser(updatedUser);
      setProfile(updatedUser);

      setEditing(false);
      setDraftUser(null);

    } catch (err) {

      console.error("Profile update failed:", err);

    }

  };

  const handleUploadNewClick = () => {
    setResumeNotice({ type: "", text: "" });
    setShowResumeUpload((prev) => !prev);
  };

  const loadResumePreview = async () => {
    const targetId = id || user?.user_id;

    if (!targetId) {
      return;
    }

    setResumePreviewLoading(true);

    try {
      const signedUrl = await getUserResumePreviewUrl(targetId);
      setResumePreviewUrl(signedUrl);
    } finally {
      setResumePreviewLoading(false);
    }
  };

  const handleToggleResumePreview = async () => {
    if (!showResumePreview) {
      try {
        if (!resumePreviewUrl) {
          await loadResumePreview();
        }
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load resume preview.";
        setResumeNotice({ type: "error", text: message });
        return;
      }
    }

    setShowResumePreview((prev) => !prev);
  };

  const handleDeleteResume = async () => {
    if (!resume) {
      setResumeNotice({ type: "error", text: "No existing resume to delete." });
      return;
    }

    const shouldDelete = window.confirm("Delete existing resume?");
    if (!shouldDelete) {
      return;
    }

    try {
      setDownloadingResume(true);
      await deleteUserResume();
      setResume(null);
      setResumePreviewUrl(null);
      setShowResumePreview(false);
      setResumeNotice({ type: "success", text: "Existing resume deleted." });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete existing resume.";
      setResumeNotice({ type: "error", text: message });
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedResumeFile(null);
      return;
    }

    const fileName = String(file.name || "").toLowerCase();
    const mimeType = String(file.type || "").toLowerCase();
    const looksLikePdf = mimeType.includes("pdf") || fileName.endsWith(".pdf");

    if (!looksLikePdf) {
      setResumeNotice({ type: "error", text: "Please select a PDF file only." });
      e.target.value = "";
      setSelectedResumeFile(null);
      return;
    }

    setSelectedResumeFile(file);
    setResumeNotice({ type: "info", text: `Selected: ${file.name}` });
  };

  const handleUploadResume = async () => {
    if (!selectedResumeFile) {
      setResumeNotice({ type: "error", text: "Choose a PDF file first." });
      return;
    }

    try {
      setUploadingResume(true);
      const uploaded = await uploadUserResume(selectedResumeFile);
      setResume(uploaded.resume);
      setResumePreviewUrl(null);
      setSelectedResumeFile(null);
      setShowResumeUpload(false);

      let previewLoaded = false;
      try {
        await loadResumePreview();
        setShowResumePreview(true);
        previewLoaded = true;
      } catch {
        setShowResumePreview(false);
      }

      alert(
        previewLoaded
          ? "Resume uploaded successfully."
          : "Resume uploaded successfully, but preview is currently unavailable."
      );
      setResumeNotice({
        type: previewLoaded ? "success" : "info",
        text: previewLoaded
          ? "Resume uploaded and preview is ready."
          : "Resume uploaded. Preview may be unavailable for this file right now.",
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to upload resume.";
      setResumeNotice({ type: "error", text: message });
    } finally {
      setUploadingResume(false);
    }
  };

  const initials =
    (profile.first_name?.[0] || "") +
    (profile.last_name?.[0] || "") ||
    profile.username?.[0];

  const avatar =
    `https://ui-avatars.com/api/?name=${initials}&background=0b0b0d&color=fff&size=128`;

  const joinedDate =
    profile.joined_at
      ? new Date(profile.joined_at).toLocaleDateString()
      : "Unknown";

  const friends = Number(profile.friends_count ?? 0);
  const closeFriends = Number(profile.close_friends_count ?? 0);

  return (

    <div className="relative w-full min-h-screen flex flex-col text-white overflow-x-hidden">

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0b0b0d] to-black"></div>

      <div className="pointer-events-none absolute -top-40 -left-40 -z-10 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="pointer-events-none absolute top-[40%] -right-40 -z-10 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <main className="flex-1 px-6 pt-28 pb-16">

        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">

            <img
              src={avatar}
              alt="avatar"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 shadow-xl object-cover"
            />

            <div className="flex-1 flex flex-col gap-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-3xl font-bold">
                    {profile.username}
                  </h2>

                  <p className="text-gray-400">
                    {profile.first_name || profile.last_name
                      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                      : "No name added"}
                  </p>
                </div>

                <div className="flex gap-3">
                  {isOwnProfile && !editing && (

                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 border border-white/40 hover:bg-white/10 px-5 py-2 rounded-md transition"
                    >
                      <Pencil size={16}/>
                      Edit
                    </button>

                  )}

                  {isOwnProfile && editing && (

                    <button
                      onClick={handleSave}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md"
                    >
                      Save
                    </button>

                  )}

                </div>

              </div>

              <div className="flex gap-12">

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {closeFriends}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Close Friends
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {friends}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Friends
                  </span>
                </div>

              </div>

            </div>

          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-xl">

            <Field label="First Name" name="first_name" value={data.first_name} editing={editing} onChange={handleChange} />
            <Field label="Last Name" name="last_name" value={data.last_name} editing={editing} onChange={handleChange} />

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p>{profile.email}</p>
            </div>

            <Field label="Phone" name="phone" value={data.phone} editing={editing} onChange={handleChange} />
            <Field label="Gender" name="gender" value={data.gender} editing={editing} onChange={handleChange} />
            <Field label="Location" name="location" value={data.location} editing={editing} onChange={handleChange} />
            <Field label="DOB" name="dob" value={data.dob || ""} editing={editing} onChange={handleChange} />

            <div>
              <p className="text-gray-400 text-sm">Joined</p>
              <p>{joinedDate}</p>
            </div>

          </div>

          {isOwnProfile && (
            <div className="mt-6 border border-white/10 bg-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText size={18} />
                  Resume Manager
                </h3>
                <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-gray-300">
                  {resume ? "Resume Uploaded" : "No Resume Uploaded"}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Upload your resume as PDF. You can preview it in a popup and download the exact cloud file.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleUploadNewClick}
                  disabled={uploadingResume || downloadingResume}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload size={16} />
                  {showResumeUpload ? "Cancel Upload" : "Upload New"}
                </button>

                {resume && (
                  <button
                    type="button"
                    onClick={handleToggleResumePreview}
                    className="px-4 py-2 rounded-md border border-white/30 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    {showResumePreview ? "Hide Resume" : "Show Resume"}
                  </button>
                )}

                {resume && (
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    disabled={downloadingResume}
                    className="px-4 py-2 rounded-md border border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    {downloadingResume ? "Deleting..." : "Delete Existing"}
                  </button>
                )}
              </div>

              {showResumeUpload && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeFileChange}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:rounded file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-white hover:file:bg-red-700"
                  />

                  <button
                    type="button"
                    onClick={handleUploadResume}
                    disabled={uploadingResume}
                    className="px-4 py-2 rounded-md border border-white/30 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingResume ? "Uploading..." : "Save Upload"}
                  </button>
                </div>
              )}

              {showResumeUpload && selectedResumeFile && (
                <p className="mt-3 text-xs text-gray-300 break-all">Selected: {selectedResumeFile.name}</p>
              )}

              {resumeNotice.text && (
                <div
                  className={`mt-4 text-sm rounded-md px-3 py-2 border ${
                    resumeNotice.type === "error"
                      ? "border-red-500/40 text-red-300 bg-red-500/10"
                      : resumeNotice.type === "success"
                        ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                        : "border-white/20 text-gray-300 bg-white/5"
                  }`}
                >
                  {resumeNotice.text}
                </div>
              )}
            </div>
          )}

          {!isOwnProfile && (
            <div className="mt-6 border border-white/10 bg-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText size={18} />
                  Resume
                </h3>
                <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-gray-300">
                  {resume ? "Resume Uploaded" : "No Resume Uploaded"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleResumePreview}
                disabled={!resume}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showResumePreview ? "Hide Resume" : "Show Resume"}
              </button>

              {resumeNotice.text && (
                <div
                  className={`mt-4 text-sm rounded-md px-3 py-2 border ${
                    resumeNotice.type === "error"
                      ? "border-red-500/40 text-red-300 bg-red-500/10"
                      : resumeNotice.type === "success"
                        ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                        : "border-white/20 text-gray-300 bg-white/5"
                  }`}
                >
                  {resumeNotice.text}
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {resume && showResumePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[88vh] bg-[#0b0b0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    Resume Preview
                  </h3>
              <button
                type="button"
                onClick={() => setShowResumePreview(false)}
                className="p-2 rounded-md border border-white/20 hover:bg-white/10 transition"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            {resumePreviewLoading && (
              <div className="w-full h-[calc(88vh-56px)] bg-black flex items-center justify-center text-gray-300">
                Loading preview...
              </div>
            )}

            {!resumePreviewLoading && resumePreviewUrl && (
              <iframe
                src={resumePreviewUrl}
                title="Resume Preview"
                className="w-full h-[calc(88vh-56px)] bg-black"
              />
            )}
          </div>
        </div>
      )}

      <Footer />

    </div>

  );

}

function Field({ label, name, value, editing, onChange, type = "text" }) {

  const displayValue =
    type === "date" && value
      ? value.split("-").reverse().join("/")
      : value;

  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>

      {editing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="bg-black/40 border border-white/10 px-3 py-2 rounded w-full"
        />
      ) : (
        <p>{displayValue || "Not added"}</p>
      )}
    </div>
  );
}

export default Profile;