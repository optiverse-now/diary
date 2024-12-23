import { describe, it, expect, beforeEach } from 'vitest'
import { useDiaryStore } from '../diaryStore'

describe('DiaryStore', () => {
  beforeEach(() => {
    const store = useDiaryStore.getState()
    store.setDiaries([])
    store.setCurrentDiary(null)
    store.setError(null)
    store.setIsLoading(false)
  })

  it('should initialize with default values', () => {
    const state = useDiaryStore.getState()
    expect(state.diaries).toEqual([])
    expect(state.currentDiary).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set diaries', () => {
    const mockDiaries = [
      {
        id: '1',
        title: 'Test Diary',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    useDiaryStore.getState().setDiaries(mockDiaries)
    expect(useDiaryStore.getState().diaries).toEqual(mockDiaries)
  })

  it('should set current diary', () => {
    const mockDiary = {
      id: '1',
      title: 'Test Diary',
      content: 'Test Content',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    useDiaryStore.getState().setCurrentDiary(mockDiary)
    expect(useDiaryStore.getState().currentDiary).toEqual(mockDiary)
  })

  it('should handle loading state', () => {
    useDiaryStore.getState().setIsLoading(true)
    expect(useDiaryStore.getState().isLoading).toBe(true)

    useDiaryStore.getState().setIsLoading(false)
    expect(useDiaryStore.getState().isLoading).toBe(false)
  })

  it('should handle error state', () => {
    const errorMessage = 'Failed to fetch diaries'
    useDiaryStore.getState().setError(errorMessage)
    expect(useDiaryStore.getState().error).toBe(errorMessage)
  })
}) 