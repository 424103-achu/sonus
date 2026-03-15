import {
    addCloseFriend,
    getCloseFriends,
    removeCloseFriend
  } from "../models/friendModel.js";
  
  export const addClose = async (req, res) => {
  
    try {
  
      const friend = await addCloseFriend(
        req.user.user_id,
        req.body.friend_id
      );
  
      res.json(friend);
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ message: "Failed" });
  
    }
  
  };
  
  export const getClose = async (req, res) => {
  
    try {
  
      const friends = await getCloseFriends(req.user.user_id);
  
      res.json(friends);
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ message: "Failed" });
  
    }
  
  };
  
  export const removeClose = async (req, res) => {

    try {
  
      const friendId = parseInt(req.params.friendId);
  
      await removeCloseFriend(
        req.user.user_id,
        friendId
      );
  
      res.json({ message: "Removed" });
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ message: "Failed" });
  
    }
  
  };