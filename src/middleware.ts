import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要保护的路由
const PROTECTED_PREFIX = '/admin'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 只处理 /admin 路由
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next()
  }

  // 登录页不需要保护（兼容有无尾部斜杠）
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    // 如果已登录，重定向到管理首页
    const authToken = request.cookies.get('admin_auth')?.value
    if (authToken) {
      return NextResponse.redirect(new URL('/admin/', request.url))
    }
    return NextResponse.next()
  }

  // 检查认证 — 只需要 cookie 存在即可
  const authToken = request.cookies.get('admin_auth')?.value
  if (!authToken) {
    // 重定向到登录页
    return NextResponse.redirect(new URL('/admin/login/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
