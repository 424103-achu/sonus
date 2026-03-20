import api from "../api/api";

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
};
