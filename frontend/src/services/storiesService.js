import { USE_MOCK_API, simulateDelay, simulateError } from '../config/api';

import { storiesData } from '../data/stories';

/**
 * Get all stories
 * @returns {Promise<Array>} Array of stories
 */
export const getAllStories = async () => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return storiesData;
  }
  // Real API call would go here
};

/**
 * Get a single story by ID
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Story object
 */
export const getStoryById = async (storyId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    return storiesData.find(story => story.id === storyId);
  }
  // Real API call would go here
};

/**
 * Mark a story as seen
 * @param {string} storyId - Story ID
 * @returns {Promise<Object>} Updated story
 */
export const markStoryAsSeen = async (storyId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const story = storiesData.find(s => s.id === storyId);
    if (story) {
      story.seen = true;
    }
    return story;
  }
  // Real API call would go here
};

/**
 * Create a new story
 * @param {Object} data - Story data
 * @returns {Promise<Object>} Created story
 */
export const createStory = async (data) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const newStory = { id: `story_${Date.now()}`, ...data };
    storiesData.unshift(newStory);
    return newStory;
  }
  // Real API call would go here
};

/**
 * Delete a story
 * @param {string} storyId - Story ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteStory = async (storyId) => {
  if (USE_MOCK_API) {
    await simulateDelay();
    simulateError();
    const index = storiesData.findIndex(story => story.id === storyId);
    if (index !== -1) {
      storiesData.splice(index, 1);
      return true;
    }
    return false;
  }
  // Real API call would go here
};
