import pool from "../utils/db.js";

export const getMutualFriendById = async (userId, friendId) => {
  const { rows } = await pool.query(
    `SELECT
      u.user_id,
      u.username,
      u.first_name,
      u.last_name
    FROM users u
    JOIN friendships f1
      ON f1.friend_id = u.user_id
     AND f1.user_id = $1
     AND f1.status = 'accepted'
    JOIN friendships f2
      ON f2.user_id = u.user_id
     AND f2.friend_id = $1
     AND f2.status = 'accepted'
    WHERE u.user_id = $2
    LIMIT 1`,
    [userId, friendId]
  );

  return rows[0] || null;
};

export const listMutualFriendThreads = async (userId) => {
  const { rows } = await pool.query(
    `WITH mutual_friends AS (
      SELECT
        u.user_id AS friend_id,
        u.username,
        u.first_name,
        u.last_name
      FROM users u
      JOIN friendships f1
        ON f1.friend_id = u.user_id
       AND f1.user_id = $1
       AND f1.status = 'accepted'
      JOIN friendships f2
        ON f2.user_id = u.user_id
       AND f2.friend_id = $1
       AND f2.status = 'accepted'
    )
    SELECT
      mf.friend_id,
      mf.username,
      mf.first_name,
      mf.last_name,
      dc.chat_id,
      lm.message_id AS last_message_id,
      lm.message AS last_message,
      lm.created_at AS last_message_at,
      lm.sender_id AS last_sender_id
    FROM mutual_friends mf
    LEFT JOIN direct_chats dc
      ON dc.user_low_id = LEAST($1, mf.friend_id)
     AND dc.user_high_id = GREATEST($1, mf.friend_id)
    LEFT JOIN LATERAL (
      SELECT
        m.message_id,
        m.sender_id,
        m.message,
        m.created_at
      FROM direct_chat_messages m
      WHERE m.chat_id = dc.chat_id
      ORDER BY m.created_at DESC, m.message_id DESC
      LIMIT 1
    ) lm ON true
    ORDER BY COALESCE(lm.created_at, dc.created_at) DESC NULLS LAST, mf.username ASC`,
    [userId]
  );

  return rows;
};

export const findOrCreateDirectChat = async (userId, friendId) => {
  const low = Math.min(userId, friendId);
  const high = Math.max(userId, friendId);

  const { rows } = await pool.query(
    `INSERT INTO direct_chats (user_low_id, user_high_id)
     VALUES ($1, $2)
     ON CONFLICT (user_low_id, user_high_id)
     DO UPDATE SET user_low_id = EXCLUDED.user_low_id
     RETURNING chat_id, user_low_id, user_high_id, created_at`,
    [low, high]
  );

  return rows[0];
};

export const getDirectChatMessages = async (chatId) => {
  const { rows } = await pool.query(
    `SELECT
      m.message_id,
      m.chat_id,
      m.sender_id,
      m.message,
      m.created_at,
      u.username AS sender_username,
      u.first_name AS sender_first_name,
      u.last_name AS sender_last_name
    FROM direct_chat_messages m
    JOIN users u ON u.user_id = m.sender_id
    WHERE m.chat_id = $1
    ORDER BY m.created_at ASC, m.message_id ASC`,
    [chatId]
  );

  return rows;
};

export const createDirectMessage = async (chatId, senderId, message) => {
  const { rows } = await pool.query(
    `INSERT INTO direct_chat_messages (chat_id, sender_id, message)
     VALUES ($1, $2, $3)
     RETURNING message_id, chat_id, sender_id, message, created_at`,
    [chatId, senderId, message]
  );

  return rows[0];
};

export const deleteDirectMessage = async (messageId, senderId) => {
  const { rows } = await pool.query(
    `DELETE FROM direct_chat_messages
     WHERE message_id = $1 AND sender_id = $2
     RETURNING message_id, chat_id`,
    [messageId, senderId]
  );

  return rows[0] || null;
};
