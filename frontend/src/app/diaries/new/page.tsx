'use client'

import { DiaryForm } from '../../../components/DiaryForm'
import { createDiary, type CreateDiaryInput } from '../../../lib/api/diary'
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewDiaryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateDiaryInput) => {
    try {
      setIsSubmitting(true)
      const response = await createDiary(data)
      toast.success('日記を作成しました')
      router.push(`/diaries/${response.id}`)
    } catch (error) {
      console.error(error)
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">新規日記作成</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <DiaryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
} 
