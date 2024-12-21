'use client'

import { DiaryList } from '../components/DiaryList'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">日記一覧</h1>
        <Link
          href="/diaries/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          新規作成
        </Link>
      </div>
      <DiaryList />
    </div>
  )
} 