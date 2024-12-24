'use client'

import { useRouter } from 'next/navigation'
import DiaryForm from '@/app/components/diary/DiaryForm'
import { createDiary } from '@/lib/api/diary'

export default function NewDiaryPage() {
  const router = useRouter()

  const handleSubmit = async (data: {
    title: string
    content: string
    moodIds: string[]
    tagIds: string[]
  }) => {
    await createDiary(data)
    router.push('/diary')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規日記作成</h1>
      <div className="max-w-2xl mx-auto">
        <DiaryForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 