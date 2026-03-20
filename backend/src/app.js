import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js"
import storyRoutes from "./routes/storyRoutes.js";
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", logoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/stories", storyRoutes);

app.use((err, req, res, next) => {
  if (err?.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
