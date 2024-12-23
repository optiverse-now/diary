import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isApplicationPage = request.nextUrl.pathname.startsWith('/applications');

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