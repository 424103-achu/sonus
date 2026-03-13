import { updateUserProfile, findUserById } from "../models/usermodel.js";
import { searchUsersByUsername } from "../models/usermodel.js";
/*
GET CURRENT USER
*/
export const getCurrentUser = async (req, res) => {

  try {

    const user = await findUserById(req.user.user_id);

    res.json(user);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });

  }

};


/*
UPDATE PROFILE
*/
export const updateProfile = async (req, res) => {

  try {

    const updatedUser = await updateUserProfile(
      req.user.user_id,
      req.body
    );

    res.json(updatedUser);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });

  }

};

export const searchUsers = async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) return res.json([]);

    const users = await searchUsersByUsername(q);

    res.json(users);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Search failed" });

  }

};

export const getUserById = async (req, res) => {

  try {

    const user = await findUserById(req.params.id);

    res.json(user);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });

  }

};