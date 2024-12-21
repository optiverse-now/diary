import { SidebarTrigger } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { Button } from "../../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Plus } from 'lucide-react'
import Link from "next/link"

// This would typically come from your database
const diaryEntries = [
  {
    id: 1,
    title: "今日の振り返り",
    content: "今日は新しいプロジェクトを始めました...",
    date: "2024-12-20",
    updated_at: "2024-12-20",
  },
  {
    id: 2,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 3,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 4,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 5,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 6,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 7,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 8,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 9,
    title: "週末の計画",
    content: "週末は友達と会う予定です...",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
  {
    id: 10,
    title: "週末の計画",
    content: "週末は友達と会う予定です...でもでもでもでも、にゃーーーーーーーーーーーーー",
    date: "2024-12-19",
    updated_at: "2024-12-20",
  },
]

export default function DiaryPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 p-6">
        <SidebarTrigger />
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Diary</h1>
              <p className="text-muted-foreground">
                日々の思いや出来事を記録しましょう
              </p>
            </div>
            <Button asChild>
              <Link href="/applications/diary/create">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diaryEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle>{entry.title}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <CardDescription>作成日時: {entry.date}</CardDescription>
                    <CardDescription>更新日時: {entry.updated_at}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{entry.content}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/applications/diary/${entry.id}/show`}>詳細</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

