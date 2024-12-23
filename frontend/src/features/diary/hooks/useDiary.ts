import { useCallback } from 'react'
import { useDiaryStore } from '../stores/diaryStore'
import { Diary } from '../stores/diaryStore'

export const useDiary = () => {
  const {
    diaries,
    currentDiary,
    isLoading,
    error,
    setDiaries,
    setCurrentDiary,
    setIsLoading,
    setError,
  } = useDiaryStore()

  const fetchDiaries = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/diaries')
      
      if (!response.ok) {
        throw new Error('Failed to fetch diaries')
      }

      const data: Diary[] = await response.json()
      setDiaries(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch diaries')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setDiaries, setError, setIsLoading])

  const createDiary = useCallback(async (title: string, content: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create diary')
      }

      const newDiary: Diary = await response.json()
      setDiaries([...diaries, newDiary])
      return newDiary
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create diary')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [diaries, setDiaries, setError, setIsLoading])

  const updateDiary = useCallback(async (id: string, title: string, content: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/diaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to update diary')
      }

      const updatedDiary: Diary = await response.json()
      setDiaries(diaries.map(diary => diary.id === id ? updatedDiary : diary))
      if (currentDiary?.id === id) {
        setCurrentDiary(updatedDiary)
      }
      return updatedDiary
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update diary')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [diaries, currentDiary, setDiaries, setCurrentDiary, setError, setIsLoading])

  const deleteDiary = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/diaries/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete diary')
      }

      setDiaries(diaries.filter(diary => diary.id !== id))
      if (currentDiary?.id === id) {
        setCurrentDiary(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete diary')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [diaries, currentDiary, setDiaries, setCurrentDiary, setError, setIsLoading])

  return {
    diaries,
    currentDiary,
    isLoading,
    error,
    fetchDiaries,
    createDiary,
    updateDiary,
    deleteDiary,
    setCurrentDiary,
  }
} 