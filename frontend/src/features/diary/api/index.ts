import type { CreateDiaryInput, DiaryListResponse, DiaryResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function getDiaries(page = 1): Promise<DiaryListResponse> {
  const response = await fetch(`${API_URL}?page=${page}`)
  if (!response.ok) {
    throw new Error('Failed to fetch diaries')
  }
  return response.json()
}

export async function getDiary(id: string): Promise<DiaryResponse> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch diary')
  }
  return response.json()
}

export async function createDiary(data: CreateDiaryInput): Promise<DiaryResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      tags: data.tags?.join(',') || '',
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to create diary')
  }
  return response.json()
}

export async function updateDiary(
  id: string,
  data: CreateDiaryInput
): Promise<DiaryResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      tags: data.tags?.join(',') || '',
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to update diary')
  }
  return response.json()
}

export async function deleteDiary(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete diary')
  }
}