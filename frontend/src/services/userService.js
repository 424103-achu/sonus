import api from "../api/api";

export const getCurrentUser = async () => {

  const { data } = await api.get("/user/me");

  return data;

};

export const updateProfile = async (profileData) => {

  const { data } = await api.put("/user/profile", profileData);

  return data;

};
export const searchUsers = async (query) => {

  const { data } = await api.get(`/user/search?q=${query}`);

  return data;

};
export const getUserById = async (id) => {

  const { data } = await api.get(`/user/${id}`);

  return data;

};