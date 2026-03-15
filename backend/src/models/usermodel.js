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
    `SELECT user_id,username, email, password_hash
     FROM users
     WHERE username = $1 OR email = $1`,
    [value]
  );

  return rows[0];
};

export const findUserById = async (userId) => {

  const { rows } = await pool.query(
    `SELECT
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
  joined_at
FROM users
WHERE user_id = $1`,
    [userId]
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
       resume`,
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