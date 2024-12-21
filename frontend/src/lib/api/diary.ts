import { z } from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const diarySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "タイトルを入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  mood: z.string().optional(),
  tags: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type CreateDiaryInput = Omit<z.infer<typeof diarySchema>, 'id' | 'createdAt' | 'updatedAt'>
export type DiaryResponse = z.infer<typeof diarySchema>

export const createDiary = async (data: CreateDiaryInput): Promise<DiaryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/diaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message || 
        `APIエラー: ${response.status} ${response.statusText}`
      )
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('APIサーバーに接続できません。サーバーが起動しているか確認してください。')
    }
    throw error instanceof Error 
      ? error 
      : new Error('APIリクエスト中に予期せぬエラーが発生しました')
  }
}

export const getDiary = async (id: number): Promise<DiaryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('日記が見つかりませんでした')
      }
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message || 
        `APIエラー: ${response.status} ${response.statusText}`
      )
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('APIサーバーに接続できません。サーバーが起動しているか確認してください。')
    }
    throw error instanceof Error 
      ? error 
      : new Error('APIリクエスト中に予期せぬエラーが発生しました')
  }
} 