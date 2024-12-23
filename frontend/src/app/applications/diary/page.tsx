'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { DiaryList } from '@/features/diary/components/DiaryList'
import { MainLayout } from '@/components/layouts'
import { getDiaries } from '@/features/diary/api'
import type { Diary } from '@/features/diary/api/types'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useIsMobile } from '@/shared/hooks/use-mobile'

export default function DiaryPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    const fetchDiaries = async () => {
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
  }, [isAuthenticated, router, currentPage])

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div className="px-6 py-6">
        <div className={`flex justify-between items-center mb-6 ${isMobile ? 'mt-8' : ''}`}>
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

