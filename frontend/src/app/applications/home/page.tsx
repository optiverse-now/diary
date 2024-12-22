'use client'

import { MainLayout } from "../../../components/templates/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600">新機能を開発中です。もうしばらくお待ちください。</p>
      </div>
    </MainLayout>
  )
}
