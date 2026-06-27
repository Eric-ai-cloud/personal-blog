/**
 * 静态导出模式检测工具
 * 通过运行时域名判断当前部署平台，不依赖构建时的环境变量
 */

/** 是否为 4EVERLAND 静态部署 */
export const isStaticMode = (): boolean => {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host.includes('4everland') || host.includes('ipfs')
}

/** 静态模式下的 Vercel 管理后台地址 */
export const getVercelAdminUrl = (path: string = '/admin'): string => {
  const base =
    typeof window !== 'undefined' && window.location.hostname.includes('4everland')
      ? 'https://personal-blog.vercel.app'
      : ''
  return `${base}${path}`
}
