'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDiary } from '@/lib/api/diary'
import Button from '@/app/components/ui/button'

interface DiaryPageProps {
  params: {
    id: string
  }
}

interface Diary {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  moods: { id: number; name: string }[]
  tags: { id: number; name: string }[]
}

export default function DiaryPage({ params }: DiaryPageProps) {
  const [diary, setDiary] = useState<Diary | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiary(parseInt(params.id))
        setDiary(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '日記の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchDiary()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-error">{error}</div>
      </div>
    )
  }

  if (!diary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>日記が見つかりません</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{diary.title}</h1>
          <div className="flex gap-2">
            <Link href={`/diary/${diary.id}/edit`}>
              <Button variant="outline">編集</Button>
            </Link>
            <Link href="/diary">
              <Button variant="ghost">一覧に戻る</Button>
            </Link>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          <time>作成: {new Date(diary.createdAt).toLocaleString('ja-JP')}</time>
          {diary.updatedAt !== diary.createdAt && (
            <time className="ml-4">
              更新: {new Date(diary.updatedAt).toLocaleString('ja-JP')}
            </time>
          )}
        </div>

        {diary.moods.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">気分タグ</h2>
            <div className="flex gap-2">
              {diary.moods.map((mood) => (
                <span
                  key={mood.id}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {mood.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {diary.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">カテゴリータグ</h2>
            <div className="flex gap-2">
              {diary.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="prose max-w-none">
          {diary.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
} 