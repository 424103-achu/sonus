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

  try {
    const { data } = await api.get(`/user/${id}`);
    console.log(`[Service] User fetched:`, data.username);
    return data;
  } catch (error) {
    console.error(`[Service] Error fetching user ${id}:`, error.message);
    throw error;
  }

};

// Separate function to fetch resume (lazy loaded)
export const getUserResume = async (id) => {

  try {
    const { data } = await api.get(`/user/${id}/resume`);
    return data.resume;
  } catch (error) {
    console.error(`[Service] Error fetching resume ${id}:`, error.message);
    return null;
  }

};

export const getHomeVisibility = async (id) => {
  const { data } = await api.get(`/user/${id}/home-visibility`);
  return data;
};

export const uploadUserResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post("/user/resume", formData);

  return data;
};

export const deleteUserResume = async () => {
  const { data } = await api.delete("/user/resume");
  return data;
};

export const getUserResumeFile = async (id) => {
  const { data } = await api.get(`/user/${id}/resume/file`, {
    responseType: "blob",
  });

  return data;
};

export const getUserResumePreviewUrl = async (id) => {
  const { data } = await api.get(`/user/${id}/resume/preview-url`);
  return data.previewUrl;
};