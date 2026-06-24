import { NextRequest, NextResponse } from 'next/server'

/**
 * 管理员登录 API
 * 验证密码后设置认证 cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      )
    }

    // 密码正确，设置认证 cookie（7天有效）
    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    )
  }
}
