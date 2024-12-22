'use client'

import { getDiary } from '../../../../../features/diary/api'
import type { DiaryResponse } from '../../../../../features/diary/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Button } from '../../../../../components/atoms/Button'
import { MainLayout } from '../../../../../components/templates/MainLayout'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/atoms/Card'

export default function ShowDiaryPage() {
  const params = useParams()
  const router = useRouter()
  const [diary, setDiary] = useState<DiaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="px-6 pt-20 pb-6">
          <p>読み込み中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!diary) {
    return (
      <MainLayout>
        <div className="px-6 pt-20 pb-6">
          <p>日記が見つかりませんでした</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{diary.title}</CardTitle>
                <CardDescription>
                  {format(parseISO(diary.createdAt), 'PPP', { locale: ja })}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/applications/diary/${diary.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">編集する</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{diary.content}</p>
            </div>
            {(diary.mood || diary.tags) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {diary.mood && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {diary.mood}
                  </span>
                )}
                {diary.tags && diary.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => router.push('/applications/diary')}
            className="w-32"
          >
            戻る
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

