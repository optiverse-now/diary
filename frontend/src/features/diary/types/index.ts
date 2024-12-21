export type CreateDiaryInput = {
  title: string
  content: string
  mood?: string
  tags?: string[]
}

export type DiaryResponse = {
  id: number
  title: string
  content: string
  mood: string
  tags: string
  created_at: string
  updated_at: string
}

export type DiaryListResponse = {
  diaries: DiaryResponse[]
  pagination: {
    current: number
    total: number
    hasMore: boolean
  }
} 