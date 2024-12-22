'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { MainLayout } from '../../../../components/templates/MainLayout'
import { Button } from '../../../../components/atoms/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/atoms/Card'
import { useAuth } from '../../../../features/auth/contexts/AuthContext'

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
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return null
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
      </div>
    </MainLayout>
  )
} 