'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '../components/auth/AuthForm'
import { signup } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth'

export default function SignupPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    if (!data.name) return
    const response = await signup({ ...data, name: data.name })
    setAuth(response.user, response.token)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの場合は{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              ログイン
            </Link>
          </p>
        </div>
        <AuthForm mode="signup" onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 