let ioInstance = null;

const userSockets = new Map();

export function setIO(io) {
  ioInstance = io;
}

export function registerSocket(userId, socketId) {
  const uid = Number(userId);
  if (!Number.isFinite(uid)) return;

  if (!userSockets.has(uid)) {
    userSockets.set(uid, new Set());
  }

  userSockets.get(uid).add(socketId);
}

export function unregisterSocket(socketId) {
  for (const [uid, sockets] of userSockets.entries()) {
    if (!sockets.has(socketId)) continue;

    sockets.delete(socketId);
    if (sockets.size === 0) {
      userSockets.delete(uid);
    }
    break;
  }
}

export function emitToUsers(userIds = [], eventName, payload) {
  if (!ioInstance) return;

  const uniqueIds = [
    ...new Set(userIds.map((id) => Number(id)).filter((id) => Number.isFinite(id)))
  ];

  for (const uid of uniqueIds) {
    const sockets = userSockets.get(uid);
    if (!sockets) continue;

    for (const socketId of sockets) {
      ioInstance.to(socketId).emit(eventName, payload);
    }
  }
}
