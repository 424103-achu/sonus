import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getItemsByStory,
  addItemByStory,
  removeItemByStory,
  updateItemByStory,
  getItemsByStoryForUser,
  searchFriendCandidates,
  getComfortZoneItemsByType,
  getComfortZoneItemsByTypeForUser,
  addComfortZoneItemByType,
  removeComfortZoneItemByType,
  updateComfortZoneItemByType,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/friends/search", verifyToken, searchFriendCandidates);
router.get("/view/:targetUserId/comfort-zone/:itemType", verifyToken, getComfortZoneItemsByTypeForUser);
router.get("/view/:targetUserId/:storyId", verifyToken, getItemsByStoryForUser);
router.get("/comfort-zone/:itemType", verifyToken, getComfortZoneItemsByType);
router.post("/comfort-zone/:itemType", verifyToken, addComfortZoneItemByType);
router.put("/comfort-zone/:itemType/:itemId", verifyToken, updateComfortZoneItemByType);
router.delete("/comfort-zone/:itemType/:itemId", verifyToken, removeComfortZoneItemByType);
router.get("/:storyId", verifyToken, getItemsByStory);
router.post("/:storyId", verifyToken, addItemByStory);
router.put("/:storyId/:itemId", verifyToken, updateItemByStory);
router.delete("/:storyId/:itemId", verifyToken, removeItemByStory);

export default router;
