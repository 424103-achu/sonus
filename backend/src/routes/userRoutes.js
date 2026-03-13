import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { updateProfile, getCurrentUser, searchUsers,getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);
router.put("/profile", verifyToken, updateProfile);
router.get("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUserById);

export default router;