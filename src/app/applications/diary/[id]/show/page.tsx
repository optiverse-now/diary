import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil } from 'lucide-react'
import Link from "next/link"

interface ShowDiaryPageProps {
  params: {
    id: string
  }
}

export default function ShowDiaryPage({ params }: ShowDiaryPageProps) {
  // This would typically fetch the diary entry from your database
  const entry = {
    id: params.id,
    title: "今日の振り返り",
    content: "今日は新しいプロジェクトを始めました。チームメンバーと一緒に計画を立て、実行に移すことができました。とても充実した一日でした。",
    date: "2024-12-20",
    mood: "やる気満々",
    tags: ["仕事", "プロジェクト"],
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">日記詳細</h1>
        <Button asChild>
          <Link href={`/applications/diary/${entry.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            編集
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{entry.title}</CardTitle>
          <CardDescription>{entry.date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">内容</h3>
            <p className="whitespace-pre-wrap">{entry.content}</p>
          </div>
          
          {entry.mood && (
            <div>
              <h3 className="mb-2 font-semibold">気分</h3>
              <p>{entry.mood}</p>
            </div>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/applications/diary">戻る</Link>
        </Button>
      </div>
    </div>
  )
}

