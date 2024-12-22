'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ArrowLeft, Pencil } from 'lucide-react'

import { MainLayout } from '../../../../../components/templates/MainLayout'
import { Button } from '../../../../../components/atoms/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/atoms/Card'
import { getDiary } from '../../../../../features/diary/api'
import type { DiaryResponse } from '../../../../../features/diary/api'

export default function ShowDiaryPage() {
  const params = useParams()
  const [diary, setDiary] = useState<DiaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setIsLoading(true)
        const id = params.id as string
        if (!id) {
          setError('無効な日記IDです')
          return
        }
        const response = await getDiary(id)
        setDiary(response)
      } catch (error) {
        console.error(error)
        setError(error instanceof Error ? error.message : '日記の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiary()
  }, [params.id])

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/applications/diary">一覧に戻る</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </MainLayout>
    )
  }

  if (!diary) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">日記が見つかりませんでした</p>
          <Button asChild className="mt-4">
            <Link href="/applications/diary">一覧に戻る</Link>
          </Button>
        </div>
      </MainLayout>
    )
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
      </div>
    </MainLayout>
  )
}

