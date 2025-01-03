'use client'

import { getDiary, updateDiary } from '../../../../../features/diary/api'
import type { DiaryResponse } from '../../../../../features/diary/api'
import type { CreateDiaryInput } from '../../../../../features/diary/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { DiaryForm } from '../../../../../components/organisms/DiaryForm'
import { MainLayout } from '../../../../../components/templates/MainLayout'

export default function EditDiaryPage() {
  const params = useParams()
  const router = useRouter()
  const [diary, setDiary] = useState<DiaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchDiary = async () => {
      if (!params?.id) return

      try {
        const data = await getDiary(params.id as string)
        setDiary(data)
      } catch (error) {
        console.error(error)
        toast.error(error instanceof Error ? error.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiary()
  }, [params?.id])

  const handleSubmit = async (data: CreateDiaryInput) => {
    if (!params?.id) return

    try {
      setIsSubmitting(true)
      await updateDiary(params.id as string, data)
      toast.success('日記を更新しました')
      router.push(`/applications/diary/${params.id}/show`)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="px-6 py-6">
          <p>読み込み中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!diary) {
    return (
      <MainLayout>
        <div className="px-6 py-6">
          <p>日記が見つかりませんでした</p>
        </div>
      </MainLayout>
    )
  }

  const initialData: CreateDiaryInput = {
    title: diary.title,
    content: diary.content,
    mood: diary.mood || '',
    tags: diary.tags || '',
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">日記を編集</h1>
        </div>
        <DiaryForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  )
}

