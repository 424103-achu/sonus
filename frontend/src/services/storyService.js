import api from "../api/api";

export const getStoryItems = async (storyId) => {
  const res = await api.get(`/stories/${storyId}`);
  return res.data;
};

export const getStoryItemsForUser = async (targetUserId, storyId) => {
  const res = await api.get(`/stories/view/${targetUserId}/${storyId}`);
  return res.data;
};

export const addStoryItem = async (storyId, payload) => {
  const res = await api.post(`/stories/${storyId}`, payload);
  return res.data;
};

export const removeStoryItem = async (storyId, itemId) => {
  await api.delete(`/stories/${storyId}/${itemId}`);
};

export const updateStoryItem = async (storyId, itemId, payload) => {
  const res = await api.put(`/stories/${storyId}/${itemId}`, payload);
  return res.data;
};

export const getComfortZoneItems = async (itemType) => {
  const res = await api.get(`/stories/comfort-zone/${itemType}`);
  return res.data;
};

export const getComfortZoneItemsForUser = async (targetUserId, itemType) => {
  const res = await api.get(`/stories/view/${targetUserId}/comfort-zone/${itemType}`);
  return res.data;
};

export const addComfortZoneItem = async (itemType, payload) => {
  const res = await api.post(`/stories/comfort-zone/${itemType}`, payload);
  return res.data;
};

export const removeComfortZoneItem = async (itemType, itemId) => {
  await api.delete(`/stories/comfort-zone/${itemType}/${itemId}`);
};

export const updateComfortZoneItem = async (itemType, itemId, payload) => {
  const res = await api.put(`/stories/comfort-zone/${itemType}/${itemId}`, payload);
  return res.data;
};
