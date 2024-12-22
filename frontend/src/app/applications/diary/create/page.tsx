'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { MainLayout } from '../../../../components/templates/MainLayout'
import { DiaryForm } from '../../../../components/organisms/DiaryForm'
import { Button } from '../../../../components/atoms/Button'
import { createDiary } from '../../../../features/diary/api'
import type { CreateDiaryInput } from '../../../../features/diary/types'

export default function CreateDiaryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      <div className="px-6 py-6">
        <Button variant="ghost" asChild>
          <Link href="/applications/diary" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
      </div>
      <div className="max-w-2xl mx-auto px-6">
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

