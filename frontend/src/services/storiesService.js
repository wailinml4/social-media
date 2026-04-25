import axiosInstance from '../config/api';

import { storiesData } from '../data/stories';

export const getAllStories = async () => {
  const response = await axiosInstance.get('/stories');
  return response.data.data;
};

export const getStoryById = async (storyId) => {
  const response = await axiosInstance.get(`/stories/${storyId}`);
  return response.data.data;
};

export const markStoryAsSeen = async (storyId) => {
  const response = await axiosInstance.post(`/stories/${storyId}/seen`);
  return response.data.data;
};

export const createStory = async (data) => {
  const response = await axiosInstance.post('/stories', data);
  return response.data.data;
};

export const deleteStory = async (storyId) => {
  const response = await axiosInstance.delete(`/stories/${storyId}`);
  return response.data.data;
};
