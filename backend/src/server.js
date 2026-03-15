import dotenv from "dotenv";
import app from "./app.js";
import express from "express";
import pool from "./utils/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
app.get("/test", (req, res) => {
  res.json({ message: "Backend working" });
});
app.get("/signup", (req, res) => {
  pool.query("SELECT 3+5 AS result1,2+4 AS result", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
