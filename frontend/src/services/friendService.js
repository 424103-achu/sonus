import api from "../api/api";

export const getCloseFriends = async () => {

  const res = await api.get("/friends/close");
  return res.data;

};

export const addCloseFriend = async (friendId) => {

  const res = await api.post("/friends/close", {
    friend_id: friendId
  });

  return res.data;

};

export const removeCloseFriend = async (friendId) => {

  await api.delete(`/friends/close/${friendId}`);

};