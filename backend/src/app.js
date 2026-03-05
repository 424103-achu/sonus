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
  res.send('<p>successfully initialised test  backend</p>');
});
export default app;
