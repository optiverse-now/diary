'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DiaryForm from '@/app/components/diary/DiaryForm'
import { getDiary, updateDiary } from '@/lib/api/diary'

interface EditDiaryPageProps {
  params: {
    id: string
  }
}

export default function EditDiaryPage({ params }: EditDiaryPageProps) {
  const router = useRouter()
  const [diary, setDiary] = useState<{
    title: string
    content: string
    moodIds: string[]
    tagIds: string[]
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiary(parseInt(params.id))
        setDiary({
          title: data.title,
          content: data.content,
          moodIds: data.moodIds,
          tagIds: data.tagIds,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '日記の取得に失敗しました')
      }
    }

    fetchDiary()
  }, [params.id])

  const handleSubmit = async (data: {
    title: string
    content: string
    moodIds: string[]
    tagIds: string[]
  }) => {
    await updateDiary(parseInt(params.id), data)
    router.push('/diary')
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-error">{error}</div>
      </div>
    )
  }

  if (!diary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">日記を編集</h1>
      <div className="max-w-2xl mx-auto">
        <DiaryForm
          initialData={diary}
          onSubmit={handleSubmit}
          isEditing
        />
      </div>
    </div>
  )
} 