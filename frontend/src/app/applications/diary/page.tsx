'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { MainLayout } from '../../../components/templates/MainLayout'
import { DiaryList } from '../../../components/organisms/DiaryList'
import { Button } from '../../../components/atoms/Button'
import { getDiaries } from '../../../features/diary/api'
import type { DiaryResponse } from '../../../features/diary/api'

export default function DiaryPage() {
  const { user } = useAuth()
  const [diaries, setDiaries] = useState<DiaryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!user?.id) {
        setError('ログインが必要です')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getDiaries(currentPage)
        setDiaries(response.diaries)
        setTotalPages(response.totalPages)
        setError(undefined)
      } catch (error) {
        console.error(error)
        setError(error instanceof Error ? error.message : '日記の取得に失敗しました')
        setDiaries([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiaries()
  }, [user?.id, currentPage])

  return (
    <MainLayout>
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">日記一覧</h1>
          <Button asChild>
            <Link href="/applications/diary/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新規作成
            </Link>
          </Button>
        </div>
        <DiaryList
          diaries={diaries}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </MainLayout>
  )
}

