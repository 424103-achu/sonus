import pool from "../utils/db.js";

/*
CREATE USER
*/
export const createUser = async (username, email, password_hash) => {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, email, joined_at`,
    [username, email, password_hash]
  );

  return rows[0];
};

/*
FIND USER BY ID (PROFILE PAGE)
*/
export const findUserForLogin = async (value) => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email, password_hash, first_name, last_name
     FROM users
     WHERE username = $1 OR email = $1`,
    [value]
  );

  return rows[0];
};

export const findUserById = async (userId) => {
  
  // Fetch basic user info (exclude resume for speed)
  const { rows } = await pool.query(
    `SELECT
      u.user_id,
      u.username,
      u.email,
      u.first_name,
      u.last_name,
      u.phone,
      u.gender,
      u.location,
      u.dob,
      u.joined_at,
      (
        SELECT COUNT(*)::int
        FROM friendships f
        WHERE f.user_id = u.user_id
          AND f.status = 'accepted'
      ) AS friends_count,
      (
        SELECT COUNT(*)::int
        FROM friendships f
        WHERE f.user_id = u.user_id
          AND f.status = 'accepted'
          AND f.favorite = true
      ) AS close_friends_count
    FROM users u
    WHERE u.user_id = $1`,
    [userId]
  );
  
  return rows[0];
};

// Separate query for resume (only fetch when needed)
export const getResumeById = async (userId) => {
  
  const { rows } = await pool.query(
    `SELECT resume FROM users WHERE user_id = $1`,
    [userId]
  );
  
  return rows[0]?.resume || null;
};

export const updateUserResume = async (userId, resumeUrl) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET resume = $1
     WHERE user_id = $2
     RETURNING user_id, resume`,
    [resumeUrl, userId]
  );

  return rows[0];
};

/*
UPDATE PROFILE
*/
export const updateUserProfile = async (
  userId,
  { first_name, last_name, phone, gender, location, dob }
) => {

  const { rows } = await pool.query(
    `UPDATE users
     SET
       first_name = COALESCE($1, first_name),
       last_name = COALESCE($2, last_name),
       phone = COALESCE($3, phone),
       gender = COALESCE($4, gender),
       location = COALESCE($5, location),
       dob = COALESCE($6, dob)
     WHERE user_id = $7
     RETURNING
       user_id,
       username,
       email,
       first_name,
       last_name,
       phone,
       gender,
       location,
       dob,
       resume,
       (
         SELECT COUNT(*)::int
         FROM friendships f
         WHERE f.user_id = users.user_id
           AND f.status = 'accepted'
       ) AS friends_count,
       (
         SELECT COUNT(*)::int
         FROM friendships f
         WHERE f.user_id = users.user_id
           AND f.status = 'accepted'
           AND f.favorite = true
       ) AS close_friends_count`,
       [
        first_name,
        last_name,
        phone,
        gender,
        location,
        dob === "" ? null : dob,
        userId
      ]
  );

  return rows[0];
};
export const searchUsersByUsername = async (query) => {

  const { rows } = await pool.query(
    `
    SELECT
      user_id,
      username,
      first_name,
      last_name
    FROM users
    WHERE username ILIKE $1
    ORDER BY username
    LIMIT 10
    `,
    [`${query}%`]
  );

  return rows;

};

export const isCloseFriendOfUser = async (targetUserId, viewerUserId) => {
  const { rows } = await pool.query(
    `SELECT 1
     FROM friendships
     WHERE user_id = $1
       AND friend_id = $2
       AND favorite = true
       AND status = 'accepted'
     LIMIT 1`,
    [targetUserId, viewerUserId]
  );

  return rows.length > 0;
};

export const getVisibleCardsForViewer = (isOwner, isCloseFriend) => {
  if (isOwner || isCloseFriend) {
    return [
      "school",
      "graduation",
      "creative-works",
      "friends",
      "close-friends",
      "comfort-zone",
      "resume",
    ];
  }

  return ["school", "graduation", "creative-works", "resume"];
};