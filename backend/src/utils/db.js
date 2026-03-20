import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool, types } = pkg;

// Return DATE columns as plain "YYYY-MM-DD" strings — prevents JS Date
// timezone conversion from shifting the date by one day.
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to PostgreSQL");
    release();
  }
});

export default pool;
