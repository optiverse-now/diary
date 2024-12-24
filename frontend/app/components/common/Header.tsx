'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import SearchInput from './SearchInput'
import Button from '../ui/button'
import { useAuthStore } from '@/lib/stores/auth'
import { logout } from '@/lib/api/auth'

interface HeaderProps {
  className?: string
}

const Header = ({ className }: HeaderProps) => {
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()
      clearAuth()
      router.push('/login')
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
    }
  }

  return (
    <header className={cn('border-b bg-white', className)}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          日記アプリ
        </Link>

        <div className="flex items-center gap-4">
          <SearchInput onSearch={console.log} className="w-64" />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/diary/new">
                <Button>新規作成</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">{user.name}</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                ログアウト
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button>新規登録</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 