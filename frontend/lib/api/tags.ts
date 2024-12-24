import { useAuthStore } from '../stores/auth'

interface Tag {
  id: string
  name: string
}

export async function getMoodTags(query?: string): Promise<Tag[]> {
  const token = useAuthStore.getState().token
  const url = new URL('/api/moods', window.location.origin)
  if (query) {
    url.searchParams.set('q', query)
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '気分タグの取得に失敗しました')
  }

  return response.json()
}

export async function getCategoryTags(query?: string): Promise<Tag[]> {
  const token = useAuthStore.getState().token
  const url = new URL('/api/tags', window.location.origin)
  if (query) {
    url.searchParams.set('q', query)
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'カテゴリータグの取得に失敗しました')
  }

  return response.json()
} 