'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '../components/auth/AuthForm'
import { login } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (data: { email: string; password: string }) => {
    const response = await login(data)
    setAuth(response.user, response.token)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントをお持ちでない場合は{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
              新規登録
            </Link>
          </p>
        </div>
        <AuthForm mode="login" onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 