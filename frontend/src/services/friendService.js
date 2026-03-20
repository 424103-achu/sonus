import api from "../api/api";

export const getCloseFriends = async () => {

  const res = await api.get("/friends/close");
  return res.data;

};

export const addCloseFriend = async (friendId) => {

  console.log("[friendService] Sending friend request:", { friendId, type: typeof friendId });
  
  try {
    const res = await api.post("/friends/close", {
      friend_id: friendId
    });

    console.log("[friendService] Success response:", res.data);
    
    // Return just the friend object, not the entire response
    return res.data.friend || res.data;
  } catch (error) {
    console.error("[friendService] Error details:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error.response?.data
    });
    throw error; // Re-throw so caller can handle it
  }

};

export const removeCloseFriend = async (friendId) => {

  await api.delete(`/friends/close/${friendId}`);

};