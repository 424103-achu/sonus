import {
  createDirectMessage,
  deleteDirectMessage,
  findOrCreateDirectChat,
  getDirectChatMessages,
  getMutualFriendById,
  listMutualFriendThreads
} from "../models/chatModel.js";
import { emitToUsers } from "../utils/realtime.js";

const mapMessage = (row, currentUserId) => ({
  message_id: row.message_id,
  chat_id: row.chat_id,
  sender_id: row.sender_id,
  message: row.message,
  created_at: row.created_at,
  sender_username: row.sender_username,
  sender_first_name: row.sender_first_name,
  sender_last_name: row.sender_last_name,
  is_mine: Number(row.sender_id) === Number(currentUserId)
});

export const listChats = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const threads = await listMutualFriendThreads(userId);

    res.json({
      chats: threads.map((thread) => ({
        friend_id: thread.friend_id,
        friend_username: thread.username,
        friend_first_name: thread.first_name,
        friend_last_name: thread.last_name,
        chat_id: thread.chat_id,
        last_message_id: thread.last_message_id,
        last_message: thread.last_message,
        last_message_at: thread.last_message_at,
        last_sender_id: thread.last_sender_id
      }))
    });
  } catch (error) {
    console.error("[chat] listChats failed:", error);
    res.status(500).json({ message: "Failed to load chats" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const friendId = Number(req.params.friendId);

    if (!Number.isFinite(userId) || !Number.isFinite(friendId)) {
      return res.status(400).json({ message: "Invalid user or friend ID" });
    }

    if (userId === friendId) {
      return res.status(400).json({ message: "Cannot open chat with yourself" });
    }

    const friend = await getMutualFriendById(userId, friendId);
    if (!friend) {
      return res.status(403).json({
        message: "Chat allowed only between mutual accepted friends"
      });
    }

    const chat = await findOrCreateDirectChat(userId, friendId);
    const messages = await getDirectChatMessages(chat.chat_id);

    res.json({
      chat: {
        chat_id: chat.chat_id,
        friend_id: friend.user_id,
        friend_username: friend.username,
        friend_first_name: friend.first_name,
        friend_last_name: friend.last_name
      },
      messages: messages.map((row) => mapMessage(row, userId))
    });
  } catch (error) {
    console.error("[chat] getMessages failed:", error);
    res.status(500).json({ message: "Failed to load chat messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const friendId = Number(req.params.friendId);
    const message = String(req.body?.message || "").trim();

    if (!Number.isFinite(userId) || !Number.isFinite(friendId)) {
      return res.status(400).json({ message: "Invalid user or friend ID" });
    }

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (message.length > 2000) {
      return res.status(400).json({ message: "Message is too long" });
    }

    const friend = await getMutualFriendById(userId, friendId);
    if (!friend) {
      return res.status(403).json({
        message: "Chat allowed only between mutual accepted friends"
      });
    }

    const chat = await findOrCreateDirectChat(userId, friendId);
    const created = await createDirectMessage(chat.chat_id, userId, message);

    const payload = {
      message_id: created.message_id,
      chat_id: created.chat_id,
      sender_id: created.sender_id,
      recipient_id: friendId,
      message: created.message,
      created_at: created.created_at,
      friend_id: friendId
    };

    emitToUsers([userId, friendId], "chat:message", payload);

    res.status(201).json({
      message: "Message sent",
      data: {
        ...payload,
        is_mine: true
      }
    });
  } catch (error) {
    console.error("[chat] sendMessage failed:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const friendId = Number(req.params.friendId);
    const messageId = Number(req.params.messageId);

    if (!Number.isFinite(userId) || !Number.isFinite(friendId) || !Number.isFinite(messageId)) {
      return res.status(400).json({ message: "Invalid user, friend, or message ID" });
    }

    const friend = await getMutualFriendById(userId, friendId);
    if (!friend) {
      return res.status(403).json({
        message: "Chat allowed only between mutual accepted friends"
      });
    }

    const deleted = await deleteDirectMessage(messageId, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found or not authorized to delete" });
    }

    emitToUsers([userId, friendId], "chat:message:deleted", {
      message_id: deleted.message_id,
      chat_id: deleted.chat_id
    });

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error("[chat] deleteMessage failed:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
