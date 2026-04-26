import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { deleteMessage, getMessages, listChats, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", verifyToken, listChats);
router.get("/:friendId/messages", verifyToken, getMessages);
router.post("/:friendId/messages", verifyToken, sendMessage);
router.delete("/:friendId/messages/:messageId", verifyToken, deleteMessage);

export default router;
