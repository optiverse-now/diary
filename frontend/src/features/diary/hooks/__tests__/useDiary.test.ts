import { renderHook, act } from '@testing-library/react'
import { useDiary } from '../useDiary'
import { useDiaryStore } from '../../stores/diaryStore'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockDiary = {
  id: '1',
  title: 'Test Diary',
  content: 'Test Content',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('useDiary', () => {
  beforeEach(() => {
    const store = useDiaryStore.getState()
    store.setDiaries([])
    store.setCurrentDiary(null)
    store.setError(null)
    store.setIsLoading(false)
    vi.clearAllMocks()
  })

  it('should fetch diaries successfully', async () => {
    const mockDiaries = [mockDiary]
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDiaries),
      })
    )

    const { result } = renderHook(() => useDiary())

    await act(async () => {
      await result.current.fetchDiaries()
    })

    expect(result.current.diaries).toEqual(mockDiaries)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch diaries failure', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    )

    const { result } = renderHook(() => useDiary())

    try {
      await act(async () => {
        await result.current.fetchDiaries()
      })
    } catch (error) {
      expect(error).toBeDefined()
    }

    expect(result.current.error).toBe('Failed to fetch diaries')
  })

  it('should create diary successfully', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDiary),
      })
    )

    const { result } = renderHook(() => useDiary())

    await act(async () => {
      await result.current.createDiary('Test Diary', 'Test Content')
    })

    expect(result.current.diaries).toEqual([mockDiary])
    expect(result.current.error).toBeNull()
  })

  it('should update diary successfully', async () => {
    const updatedDiary = { ...mockDiary, title: 'Updated Title' }
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedDiary),
      })
    )

    const { result } = renderHook(() => useDiary())
    
    act(() => {
      useDiaryStore.getState().setDiaries([mockDiary])
    })

    await act(async () => {
      await result.current.updateDiary('1', 'Updated Title', 'Test Content')
    })

    expect(result.current.diaries[0].title).toBe('Updated Title')
    expect(result.current.error).toBeNull()
  })

  it('should delete diary successfully', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    )

    const { result } = renderHook(() => useDiary())
    
    act(() => {
      useDiaryStore.getState().setDiaries([mockDiary])
    })

    await act(async () => {
      await result.current.deleteDiary('1')
    })

    expect(result.current.diaries).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should set current diary', () => {
    const { result } = renderHook(() => useDiary())

    act(() => {
      result.current.setCurrentDiary(mockDiary)
    })

    expect(result.current.currentDiary).toEqual(mockDiary)
  })
}) 