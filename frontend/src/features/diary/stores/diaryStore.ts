import { create } from 'zustand'

export type Diary = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

type DiaryStore = {
  diaries: Diary[]
  currentDiary: Diary | null
  isLoading: boolean
  error: string | null
  setDiaries: (diaries: Diary[]) => void
  setCurrentDiary: (diary: Diary | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useDiaryStore = create<DiaryStore>((set) => ({
  diaries: [],
  currentDiary: null,
  isLoading: false,
  error: null,
  setDiaries: (diaries) => set({ diaries }),
  setCurrentDiary: (diary) => set({ currentDiary: diary }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})) 