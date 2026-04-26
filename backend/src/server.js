import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import pool from "./utils/db.js";
import { registerSocket, setIO, unregisterSocket } from "./utils/realtime.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

setIO(io);

io.on("connection", (socket) => {
  const userId = Number(socket.handshake.query.userId);
  if (Number.isFinite(userId)) {
    registerSocket(userId, socket.id);
  }

  socket.on("disconnect", () => {
    unregisterSocket(socket.id);
  });
});

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
server.listen(PORT, HOST, () => {
  const hostForLog = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`Server running on http://${hostForLog}:${PORT}`);
});
