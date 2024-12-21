'use client'

import { AppSidebar } from '../../../../../components/app-sidebar'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../../../../components/ui/button'
import Link from 'next/link'
import { getDiary, updateDiary, type DiaryResponse, type UpdateDiaryInput } from '../../../../../lib/api/diary'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { DiaryForm } from '../../../../../components/DiaryForm'

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
        const data = await getDiary(Number(params.id))
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

  const handleSubmit = async (data: UpdateDiaryInput) => {
    if (!params?.id) return

    try {
      setIsSubmitting(true)
      await updateDiary(Number(params.id), data)
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
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex-1 w-[calc(100vw-255px)]">
          <div className="px-6 py-6">
            <p>読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!diary) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex-1 w-[calc(100vw-255px)]">
          <div className="px-6 py-6">
            <p>日記が見つかりませんでした</p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/applications/diary">戻る</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const initialData: UpdateDiaryInput = {
    title: diary.title,
    content: diary.content,
    mood: diary.mood || '',
    tags: diary.tags || '',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 w-[calc(100vw-255px)]">
        <div className="px-6 py-6">
          <Button variant="ghost" asChild>
            <Link href={`/applications/diary/${diary.id}/show`} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Link>
          </Button>
        </div>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">日記を編集</h1>
          </div>
          <DiaryForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}

