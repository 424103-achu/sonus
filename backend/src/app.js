import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send('<p>successfully initialised backend</p>');
});
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

export default app;
