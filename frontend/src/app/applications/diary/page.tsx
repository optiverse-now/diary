'use client'

import { MainLayout } from '../../../components/templates/MainLayout'
import { DiaryList } from '../../../components/organisms/DiaryList'

export default function DiaryPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <DiaryList />
      </div>
    </MainLayout>
  )
}

