'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDiaries } from '@/lib/api/diary'
import Button from '@/app/components/ui/button'

interface Diary {
  id: number
  title: string
  content: string
  createdAt: string
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await getDiaries()
        setDiaries(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '日記の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchDiaries()
  }, [])

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">日記一覧</h1>
        <Link href="/diary/new">
          <Button>新規作成</Button>
        </Link>
      </div>

      {diaries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">まだ日記がありません</p>
          <Link href="/diary/new" className="mt-4 inline-block">
            <Button>最初の日記を書く</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {diaries.map((diary) => (
            <Link
              key={diary.id}
              href={`/diary/${diary.id}`}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{diary.title}</h2>
                <time className="text-sm text-gray-500">
                  {new Date(diary.createdAt).toLocaleDateString('ja-JP')}
                </time>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{diary.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 