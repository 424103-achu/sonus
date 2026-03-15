import api from "../api/api";

export const login = async (identifier, password) => {
  const { data } = await api.post("/auth/login", {
    identifier,
    password,
  });

  return data;
};

export const register = async (username, email, password) => {
  const { data } = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return data;
};

export const updateProfile = async (profileData) => {

    const { data } = await api.put("/user/profile", profileData);
  
    return data;
  
  };