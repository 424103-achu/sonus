import {
    addCloseFriend,
    getCloseFriends,
    removeCloseFriend
  } from "../models/friendModel.js";
  
  export const addClose = async (req, res) => {
  
    try {
  
      const { friend_id } = req.body;
      const userId = req.user.user_id;

      console.log("Add close friend request:", { 
        body: req.body, 
        userId, 
        friend_id,
        userObject: req.user 
      });

      // Validate input
      if (!friend_id && friend_id !== 0) {
        return res.status(400).json({ message: "Friend ID is required" });
      }

      // Convert IDs to numbers for comparison (in case of type mismatch)
      const friendIdNum = Number(friend_id);
      const userIdNum = Number(userId);

      if (isNaN(friendIdNum) || isNaN(userIdNum)) {
        console.error("Invalid ID format:", { friendIdNum, userIdNum });
        return res.status(400).json({ message: "Invalid user or friend ID format" });
      }

      // Prevent adding yourself as a friend
      if (friendIdNum === userIdNum) {
        return res.status(400).json({ message: "Cannot add yourself as a friend" });
      }
  
      const friend = await addCloseFriend(userIdNum, friendIdNum);

      if (!friend) {
        return res.status(404).json({
          message: "Friendship not found. Add user to friends first before marking as close friend.",
        });
      }
  
      res.json({ message: "Friend added to close friends", friend });
  
    } catch (err) {
  
      console.error("Error adding close friend:", err);
      
      if (err.code === '23503') {
        return res.status(400).json({ message: "Friend not found" });
      }
      
      res.status(500).json({ message: "Failed to add friend", error: err.message });
  
    }
  
  };
  
  export const getClose = async (req, res) => {
  
    try {
  
      const userId = Number(req.user.user_id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const friends = await getCloseFriends(userId);
  
      res.json(friends);
  
    } catch (err) {
  
      console.error("Error getting close friends:", err);
      res.status(500).json({ message: "Failed to get close friends", error: err.message });
  
    }
  
  };
  
  export const removeClose = async (req, res) => {

    try {
  
      const friendId = Number(req.params.friendId);
      const userId = Number(req.user.user_id);

      if (isNaN(friendId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
  
      const affectedRows = await removeCloseFriend(userId, friendId);

      if (!affectedRows) {
        return res.status(404).json({
          message: "Close friend record not found",
        });
      }
  
      res.json({ message: "Friend removed from close friends" });
  
    } catch (err) {
  
      console.error("Error removing close friend:", err);
      res.status(500).json({ message: "Failed to remove friend", error: err.message });
  
    }
  
  };