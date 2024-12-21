'use client'

import { DiaryForm } from '../../../components/DiaryForm'

export default function NewDiaryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規日記作成</h1>
      <DiaryForm />
    </div>
  )
} 