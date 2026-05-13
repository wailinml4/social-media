import type { StoryResumeMap, StorySlidePayload } from '../types'
import type { Story } from '../types'
import axiosInstance from '../config/api.js'

export const getStories = async (): Promise<Story[]> => {
  const response = await axiosInstance.get('/stories')
  return response.data.data
}

export const createStory = async (slides: StorySlidePayload[]): Promise<Story> => {
  const response = await axiosInstance.post('/stories', { slides })
  return response.data.data
}

export const getUserStories = async (userId: string): Promise<Story[]> => {
  const response = await axiosInstance.get(`/stories/user/${userId}`)
  return response.data.data
}

const STORY_RESUME_KEY = 'story_resume_positions'

const readStoryResumeMap = () => {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORY_RESUME_KEY) || '{}')
  } catch {
    return {}
  }
}

const writeStoryResumeMap = (map: StoryResumeMap) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORY_RESUME_KEY, JSON.stringify(map))
  } catch {
    // Ignore localStorage write failures
  }
}

export const getStoryResumeSlideIndex = (storyId: string) => {
  const map = readStoryResumeMap()
  const value = map[storyId]
  return Number.isInteger(value) && value >= 0 ? value : 0
}

export const setStoryResumeSlideIndex = (storyId: string, slideIndex: number) => {
  const map = readStoryResumeMap()
  map[storyId] = Math.max(0, Number(slideIndex) || 0)
  writeStoryResumeMap(map)
}

export const clearStoryResumeSlideIndex = (storyId: string) => {
  const map = readStoryResumeMap()
  if (map[storyId] !== undefined) {
    delete map[storyId]
    writeStoryResumeMap(map)
  }
}

export const markStoryViewed = async (storyId: string): Promise<Story> => {
  const response = await axiosInstance.patch(`/stories/${storyId}/view`)
  return response.data.data
}

export const deleteStorySlide = async (slideId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/stories/${slideId}`)
  return response.data.data
}
