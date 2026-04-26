import { io } from "socket.io-client";

let socket = null;

export function getRealtimeSocket(userId) {
  if (!userId) {
    return null;
  }

  if (!socket) {
    const apiBase =
      import.meta.env.VITE_API_URL ||
      `${window.location.protocol}//${window.location.hostname}:5000/api`;
    const base = import.meta.env.VITE_SOCKET_URL || apiBase.replace(/\/api\/?$/, "");

    socket = io(base, {
      transports: ["websocket", "polling"],
      query: { userId: String(userId) }
    });
  }

  return socket;
}

export function closeRealtimeSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}
