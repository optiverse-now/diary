const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/diaries'

export type Diary = {
  id: number
  title: string
  content: string
  mood: string
  tags: string
  created_at: string
  updated_at: string
}

export type CreateDiaryInput = Omit<Diary, 'id' | 'created_at' | 'updated_at'>
export type UpdateDiaryInput = Partial<CreateDiaryInput>

// 日記一覧を取得
export const getDiaries = async (page = 1, limit = 9) => {
  const response = await fetch(
    `${API_BASE_URL}?page=${page}&limit=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch diaries')
  }
  return response.json()
}

// 日記詳細を取得
export const getDiary = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch diary')
  }
  return response.json()
}

// 日記を作成
export const createDiary = async (data: CreateDiaryInput) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create diary')
  }
  return response.json()
}

// 日記を更新
export const updateDiary = async (id: number, data: UpdateDiaryInput) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update diary')
  }
  return response.json()
} 