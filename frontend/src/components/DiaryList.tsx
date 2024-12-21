import { useEffect, useState } from 'react'
import { getDiaries, Diary } from '../lib/api'
import Link from 'next/link'

type PaginationData = {
  current: number
  total: number
  hasMore: boolean
}

export const DiaryList = () => {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    current: 1,
    total: 1,
    hasMore: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDiaries = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await getDiaries(page)
      setDiaries(response.diaries)
      setPagination(response.pagination)
      setError(null)
    } catch (err) {
      setError('日記の取得に失敗しました')
      console.error('Error fetching diaries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiaries()
  }, [])

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>
  }

  if (diaries.length === 0) {
    return (
      <div className="text-center py-4">
        日記がありません。
        <Link
          href="/diaries/new"
          className="text-indigo-600 hover:text-indigo-800 ml-2"
        >
          新しい日記を作成する
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diaries.map((diary) => (
          <div
            key={diary.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{diary.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{diary.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>気分: {diary.mood}</span>
                  {diary.tags && <span>タグ: {diary.tags}</span>}
                </div>
                <span>
                  {new Date(diary.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <Link
                href={`/diaries/${diary.id}`}
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
              >
                詳細を見る →
              </Link>
            </div>
          </div>
        ))}
      </div>

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