import { useAuthStore } from '../stores/auth'

interface DiaryData {
  title: string
  content: string
  moodIds: string[]
  tagIds: string[]
}

interface Diary extends DiaryData {
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  moods: { id: number; name: string }[]
  tags: { id: number; name: string }[]
}

export async function createDiary(data: DiaryData): Promise<Diary> {
  const token = useAuthStore.getState().token
  const response = await fetch('/api/diaries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '日記の作成に失敗しました')
  }

  return response.json()
}

export async function updateDiary(id: number, data: DiaryData): Promise<Diary> {
  const token = useAuthStore.getState().token
  const response = await fetch(`/api/diaries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '日記の更新に失敗しました')
  }

  return response.json()
}

export async function getDiary(id: number): Promise<Diary> {
  const token = useAuthStore.getState().token
  const response = await fetch(`/api/diaries/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '日記の取得に失敗しました')
  }

  return response.json()
}

export async function getDiaries(): Promise<Diary[]> {
  const token = useAuthStore.getState().token
  const response = await fetch('/api/diaries', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '日記一覧の取得に失敗しました')
  }

  return response.json()
} 