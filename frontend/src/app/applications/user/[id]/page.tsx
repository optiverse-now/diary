'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layouts'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/contexts/AuthContext'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, clearAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // 現在のユーザー以外のページにアクセスしようとした場合、ダイアリー一覧ページにリダイレクト
    if (user.id !== params.id) {
      router.push('/applications/diary')
      return
    }

    setIsLoading(false)
  }, [user, params.id, router])

  const handleLogout = () => {
    clearAuth()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="px-6 pt-20 pb-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">アカウント情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">名前</h3>
                <p className="mt-1">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">メールアドレス</h3>
                <p className="mt-1">{user.email}</p>
              </div>
              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                >
                  ログアウト
                </Button>
              </div>
            </div>
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