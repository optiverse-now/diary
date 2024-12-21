'use client'

import { SidebarTrigger } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { Button } from "../../../components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"
import { DiaryList } from "../../../components/DiaryList"

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

          <div className="mt-6">
            <DiaryList />
          </div>
        </div>
      </div>
    </div>
  )
}

