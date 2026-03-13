import pool from "../utils/db.js";

export const addCloseFriend = async (userId, friendId) => {

    const result = await pool.query(
      `INSERT INTO friendships (user_id, friend_id, favorite, status)
       VALUES ($1, $2, true, 'accepted')
  
       ON CONFLICT (user_id, friend_id)
       DO UPDATE
       SET favorite = true
  
       RETURNING *`,
      [userId, friendId]
    );
  
    return result.rows[0];
  
  };

export const getCloseFriends = async (userId) => {

    const result = await pool.query(
      `SELECT 
          u.user_id,
          u.username,
          u.first_name,
          u.last_name
       FROM friendships f
       JOIN users u
         ON u.user_id = f.friend_id
       WHERE f.user_id = $1
       AND f.favorite = true
       AND f.status = 'accepted'`,
      [userId]
    );
  
    return result.rows;
  };

  export const removeCloseFriend = async (userId, friendId) => {

    await pool.query(
      `UPDATE friendships
       SET favorite = false
       WHERE user_id = $1
       AND friend_id = $2`,
      [userId, friendId]
    );
  
  };