'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Pencil, Plus } from 'lucide-react'

import { Button } from '../../atoms/Button'
import { getDiaries } from '../../../features/diary/api'
import type { DiaryListResponse } from '../../../features/diary/types'

export const DiaryList = () => {
  const [diaries, setDiaries] = useState<DiaryListResponse['diaries']>([])
  const [pagination, setPagination] = useState<DiaryListResponse['pagination']>({
    total: 0,
    current: 1,
    hasMore: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchDiaries = async (page = 1) => {
    try {
      setIsLoading(true)
      const response = await getDiaries(page)
      setDiaries(response.diaries)
      setPagination(response.pagination)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDiaries()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">日記一覧</h1>
        <Button asChild>
          <Link href="/applications/diary/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {diaries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">日記がありません</p>
          <Button asChild className="mt-4">
            <Link href="/applications/diary/create">
              最初の��記を書く
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{diary.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {format(new Date(diary.created_at), 'PPP', { locale: ja })}
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/applications/diary/${diary.id}/show`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">詳細を見る</span>
                  </Link>
                </Button>
              </div>
              <p className="text-muted-foreground line-clamp-3">{diary.content}</p>
              {(diary.mood || diary.tags) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {diary.mood && (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {diary.mood}
                    </span>
                  )}
                  {diary.tags && diary.tags.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination.total > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: pagination.total }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => fetchDiaries(page)}
                className={`px-4 py-2 rounded ${
                  pagination.current === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
} 