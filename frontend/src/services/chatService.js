import api from "../api/api";

export const getChats = async () => {
  const { data } = await api.get("/chats");
  return data.chats || [];
};

export const getChatMessages = async (friendId) => {
  const { data } = await api.get(`/chats/${friendId}/messages`);
  return data;
};

export const sendChatMessage = async (friendId, message) => {
  const { data } = await api.post(`/chats/${friendId}/messages`, { message });
  return data;
};

export const deleteChatMessage = async (friendId, messageId) => {
  const { data } = await api.delete(`/chats/${friendId}/messages/${messageId}`);
  return data;
};
