/**
 * 静态导出模式检测工具
 * 用于在组件中判断当前是否为静态部署模式（4EVERLAND IPFS）
 */

/** 是否为静态导出模式 */
export const isStaticMode = (): boolean =>
  process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true'

/** 静态模式下的 Vercel 管理后台地址 */
export const getVercelAdminUrl = (path: string = '/admin'): string => {
  const base = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://personal-blog.vercel.app'
  return `${base}${path}`
}
