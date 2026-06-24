import { NextResponse } from 'next/server'

/**
 * 管理员退出登录 API
 * 清除认证 cookie
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // 立即过期
    path: '/',
  })
  return response
}
