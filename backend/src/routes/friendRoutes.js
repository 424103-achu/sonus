import express from "express";
import {
  addClose,
  getClose,
  removeClose,
  deleteFriend
} from "../controllers/friendController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/close",verifyToken, getClose);
router.post("/close",verifyToken, addClose);
router.delete("/close/:friendId",verifyToken, removeClose);
router.delete("/:friendId",verifyToken, deleteFriend);

export default router;