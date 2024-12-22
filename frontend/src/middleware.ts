import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApplicationPage = request.nextUrl.pathname.startsWith('/applications');

  // 認証ページにアクセスしようとしている場合
  if (isAuthPage) {
    // すでにログインしている場合は日記一覧ページにリダイレクト
    if (token) {
      return NextResponse.redirect(new URL('/applications/diary', request.url));
    }
    // ログインしていない場合はそのまま認証ページを表示
    return NextResponse.next();
  }

  // アプリケーションページにアクセスしようとしている場合
  if (isApplicationPage) {
    // ログインしていない場合はログインページにリダイレクト
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // ログインしている場合はそのままアプリケーションページを表示
    return NextResponse.next();
  }

  // その他のページはそのまま表示
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/applications/:path*',
  ],
}; 