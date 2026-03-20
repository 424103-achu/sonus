import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/logout", verifyToken, logout);

export default router;
