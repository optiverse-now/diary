'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useIsMobile } from '@/shared/hooks/use-mobile'

import { MainLayout } from '@/components/layouts'
import { DiaryForm } from '@/features/diary/components/DiaryForm'
import { createDiary } from '@/features/diary/api'
import type { CreateDiaryInput } from '@/features/diary/types'

export default function CreateDiaryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useIsMobile()

  const handleSubmit = async (data: CreateDiaryInput) => {
    try {
      setIsSubmitting(true)
      const response = await createDiary(data)
      toast.success('日記を作成しました')
      router.push(`/applications/diary/${response.id}/show`)
    } catch (error) {
      console.error(error)
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className={`max-w-2xl mx-auto px-6 py-6 ${isMobile ? 'mt-8' : ''}`}>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">新規日記作成</h1>
          <p className="text-muted-foreground mt-2">
            今日の出来事や感情を記録しましょう
          </p>
        </div>
        <DiaryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  )
}

