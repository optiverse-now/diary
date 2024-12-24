import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authPaths = ['/login', '/signup']
  const protectedPaths = ['/diary', '/profile']
  const path = request.nextUrl.pathname

  // 認証情報の取得
  const authStorage = request.cookies.get('auth-storage')
  const isAuthenticated = authStorage && JSON.parse(authStorage.value).state.token

  // 認証済みユーザーが認証ページにアクセスした場合
  if (isAuthenticated && authPaths.some(authPath => path.startsWith(authPath))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 未認証ユーザーが保護されたページにアクセスした場合
  if (!isAuthenticated && protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/diary/:path*',
    '/profile',
  ],
} 