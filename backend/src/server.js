import dotenv from "dotenv";
import app from "./app.js";
import db from "./utils/db.js"; 
import express from 'express'

dotenv.config();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.get("/test", (req, res) => {
  res.json({ message: "Backend working" });
});
app.get("/signup", (req, res) => {
  db.query("SELECT 3+5 AS result", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
