'use client'

import { Button } from "../../../../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card"
import { Pencil, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { getDiary, type DiaryResponse } from "../../../../../lib/api/diary"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { useParams } from "next/navigation"

export default function ShowDiaryPage() {
  const params = useParams()
  const [diary, setDiary] = useState<DiaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-6 mx-auto">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!diary) {
    return (
      <div className="container max-w-2xl py-6 mx-auto">
        <p>日記が見つかりませんでした</p>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/applications/diary">戻る</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/applications/diary" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/applications/diary/${diary.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            編集
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{diary.title}</CardTitle>
          {diary.createdAt && (
            <CardDescription>
              {format(new Date(diary.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">内容</h3>
            <p className="whitespace-pre-wrap">{diary.content}</p>
          </div>
          
          {diary.mood && (
            <div>
              <h3 className="mb-2 font-semibold">気分</h3>
              <p>{diary.mood}</p>
            </div>
          )}
          
          {diary.tags && (
            <div>
              <h3 className="mb-2 font-semibold">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {diary.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

