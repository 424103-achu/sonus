import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
	updateProfile,
	getCurrentUser,
	searchUsers,
	getUserById,
	getResume,
	deleteResume,
	getResumePreviewUrl,
	getResumeFile,
	uploadResume,
	getHomeVisibility,
} from "../controllers/userController.js";

const router = express.Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const mimeType = String(file.mimetype || "").toLowerCase();
		const name = String(file.originalname || "").toLowerCase();
		const isPdf = mimeType.includes("pdf") || name.endsWith(".pdf");

		if (!isPdf) {
			cb(new Error("Only PDF files are allowed"));
			return;
		}

		cb(null, true);
	},
});

router.get("/me", verifyToken, getCurrentUser);
router.put("/profile", verifyToken, updateProfile);
router.post("/resume", verifyToken, upload.single("resume"), uploadResume);
router.delete("/resume", verifyToken, deleteResume);
router.get("/search", verifyToken, searchUsers);
router.get("/:id/home-visibility", verifyToken, getHomeVisibility);
router.get("/:id/resume", verifyToken, getResume);
router.get("/:id/resume/preview-url", verifyToken, getResumePreviewUrl);
router.get("/:id/resume/file", verifyToken, getResumeFile);
router.get("/:id", verifyToken, getUserById);

export default router;