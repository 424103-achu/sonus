import { searchUsersByUsername } from "../models/usermodel.js";
import {
  getStoryItems,
  addStoryItem,
  deleteStoryItem,
  updateStoryItem,
  getComfortZoneItems,
  addComfortZoneItem,
  deleteComfortZoneItem,
  updateComfortZoneItem,
} from "../models/storyModel.js";
import { isCloseFriendOfUser } from "../models/usermodel.js";

const SUPPORTED_STORY_IDS = new Set([
  "close-friends",
  "friends",
  "creative-works",
  "school",
  "graduation",
  "comfort-zone",
]);

const SUPPORTED_COMFORT_TYPES = new Set(["movies", "foods"]);
const PERSONAL_STORY_IDS = new Set(["friends", "close-friends", "comfort-zone"]);

const canViewPersonalStories = async (viewerId, targetUserId) => {
  if (viewerId === targetUserId) {
    return true;
  }

  return isCloseFriendOfUser(targetUserId, viewerId);
};

export const getItemsByStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    if (!SUPPORTED_STORY_IDS.has(storyId)) {
      return res.status(400).json({ message: "Unsupported story type" });
    }

    const items = await getStoryItems(Number(req.user.user_id), storyId);

    res.json(items);
  } catch (err) {
    console.error("Error loading story items:", err);
    res.status(500).json({ message: "Failed to load story items" });
  }
};

export const addItemByStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    if (!SUPPORTED_STORY_IDS.has(storyId)) {
      return res.status(400).json({ message: "Unsupported story type" });
    }

    if (storyId === "friends") {
      const friendIdNum = Number(req.body.friend_id);
      const userIdNum = Number(req.user.user_id);

      if (isNaN(friendIdNum)) {
        return res.status(400).json({ message: "Friend ID is required" });
      }

      if (friendIdNum === userIdNum) {
        return res.status(400).json({ message: "Cannot add yourself as a friend" });
      }
    }

    const item = await addStoryItem(Number(req.user.user_id), storyId, req.body);

    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding story item:", err);

    if (err.code === "23503") {
      return res.status(400).json({ message: "Referenced record not found" });
    }

    res.status(500).json({ message: "Failed to add story item" });
  }
};

export const removeItemByStory = async (req, res) => {
  try {
    const { storyId, itemId } = req.params;

    if (!SUPPORTED_STORY_IDS.has(storyId)) {
      return res.status(400).json({ message: "Unsupported story type" });
    }

    const affectedRows = await deleteStoryItem(Number(req.user.user_id), storyId, Number(itemId));

    if (!affectedRows) {
      return res.status(404).json({ message: "Item not found or already removed" });
    }

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Error deleting story item:", err);
    res.status(500).json({ message: "Failed to delete story item" });
  }
};

export const updateItemByStory = async (req, res) => {
  try {
    const { storyId, itemId } = req.params;

    if (!SUPPORTED_STORY_IDS.has(storyId)) {
      return res.status(400).json({ message: "Unsupported story type" });
    }

    if (storyId === "friends") {
      return res.status(400).json({ message: "Friends entries cannot be edited here" });
    }

    if (storyId === "creative-works") {
      const projectName = String(req.body.project_name || "").trim();

      if (!projectName) {
        return res.status(400).json({ message: "Project name is required" });
      }
    }

    if (storyId === "school" || storyId === "graduation") {
      const schoolName = String(req.body.school_name || "").trim();

      if (!schoolName) {
        return res.status(400).json({ message: "School name is required" });
      }
    }

    const updated = await updateStoryItem(
      Number(req.user.user_id),
      storyId,
      Number(itemId),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating story item:", err);
    res.status(500).json({ message: "Failed to update story item" });
  }
};

export const searchFriendCandidates = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const users = await searchUsersByUsername(q);
    const filtered = users.filter((u) => Number(u.user_id) !== Number(req.user.user_id));

    res.json(filtered);
  } catch (err) {
    console.error("Error searching friend candidates:", err);
    res.status(500).json({ message: "Search failed" });
  }
};

export const getComfortZoneItemsByType = async (req, res) => {
  try {
    const { itemType } = req.params;

    if (!SUPPORTED_COMFORT_TYPES.has(itemType)) {
      return res.status(400).json({ message: "Unsupported comfort-zone item type" });
    }

    const items = await getComfortZoneItems(Number(req.user.user_id), itemType);

    res.json(items);
  } catch (err) {
    console.error("Error loading comfort-zone items:", err);
    res.status(500).json({ message: "Failed to load comfort-zone items" });
  }
};

export const getItemsByStoryForUser = async (req, res) => {
  try {
    const { storyId, targetUserId } = req.params;
    const targetUserIdNum = Number(targetUserId);
    const viewerIdNum = Number(req.user.user_id);

    if (!SUPPORTED_STORY_IDS.has(storyId)) {
      return res.status(400).json({ message: "Unsupported story type" });
    }

    if (PERSONAL_STORY_IDS.has(storyId)) {
      const allowed = await canViewPersonalStories(viewerIdNum, targetUserIdNum);

      if (!allowed) {
        return res.status(403).json({ message: "This story is visible only to close friends" });
      }
    }

    if (storyId === "comfort-zone") {
      return res.status(400).json({ message: "Use comfort-zone typed endpoint" });
    }

    const items = await getStoryItems(targetUserIdNum, storyId);
    res.json(items);
  } catch (err) {
    console.error("Error loading target user story items:", err);
    res.status(500).json({ message: "Failed to load story items" });
  }
};

export const getComfortZoneItemsByTypeForUser = async (req, res) => {
  try {
    const { itemType, targetUserId } = req.params;
    const targetUserIdNum = Number(targetUserId);
    const viewerIdNum = Number(req.user.user_id);

    if (!SUPPORTED_COMFORT_TYPES.has(itemType)) {
      return res.status(400).json({ message: "Unsupported comfort-zone item type" });
    }

    const allowed = await canViewPersonalStories(viewerIdNum, targetUserIdNum);

    if (!allowed) {
      return res.status(403).json({ message: "Comfort zone is visible only to close friends" });
    }

    const items = await getComfortZoneItems(targetUserIdNum, itemType);
    res.json(items);
  } catch (err) {
    console.error("Error loading target user comfort-zone items:", err);
    res.status(500).json({ message: "Failed to load comfort-zone items" });
  }
};

export const addComfortZoneItemByType = async (req, res) => {
  try {
    const { itemType } = req.params;

    if (!SUPPORTED_COMFORT_TYPES.has(itemType)) {
      return res.status(400).json({ message: "Unsupported comfort-zone item type" });
    }

    const itemName = String(req.body.name || "").trim();

    if (!itemName) {
      return res.status(400).json({ message: "Name is required" });
    }

    const item = await addComfortZoneItem(Number(req.user.user_id), itemType, {
      name: itemName,
      comment: req.body.comment,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding comfort-zone item:", err);
    res.status(500).json({ message: "Failed to add comfort-zone item" });
  }
};

export const removeComfortZoneItemByType = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;

    if (!SUPPORTED_COMFORT_TYPES.has(itemType)) {
      return res.status(400).json({ message: "Unsupported comfort-zone item type" });
    }

    const affectedRows = await deleteComfortZoneItem(
      Number(req.user.user_id),
      itemType,
      Number(itemId)
    );

    if (!affectedRows) {
      return res.status(404).json({ message: "Item not found or already removed" });
    }

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Error deleting comfort-zone item:", err);
    res.status(500).json({ message: "Failed to delete comfort-zone item" });
  }
};

export const updateComfortZoneItemByType = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;

    if (!SUPPORTED_COMFORT_TYPES.has(itemType)) {
      return res.status(400).json({ message: "Unsupported comfort-zone item type" });
    }

    const itemName = String(req.body.name || "").trim();

    if (!itemName) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updated = await updateComfortZoneItem(Number(req.user.user_id), itemType, Number(itemId), {
      name: itemName,
      comment: req.body.comment,
    });

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating comfort-zone item:", err);
    res.status(500).json({ message: "Failed to update comfort-zone item" });
  }
};
