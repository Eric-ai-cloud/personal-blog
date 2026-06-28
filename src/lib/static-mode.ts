/**
 * 静态导出模式检测工具
 *
 * 双重检测机制（按优先级）：
 * 1. 构建时变量：NEXT_PUBLIC_STATIC_EXPORT（通过 Webpack DefinePlugin 烘焙进 JS）
 *    - 4EVERLAND 构建时替换为字面量 'true'，SSR 和客户端完全一致
 *    - Vercel 构建时替换为字面量 'false'
 * 2. 运行时域名检测：检测 hostname 是否包含 '4everland' 或 'ipfs'
 *    - 作为降级方案，用于未设置构建变量的场景
 *
 * 为什么不用纯运行时检测：
 *   Next.js 静态导出会在构建时执行 SSR（此时无 window），
 *   isStaticMode() 返回 false，生成的是完整后台 HTML。
 *   浏览器端执行时 isStaticMode() 返回 true，渲染 StaticFallback，
 *   导致 React hydration mismatch，页面闪现破损 UI。
 *
 * 使用构建时变量后：4EVERLAND 构建时 SSR 和客户端都看到 'true'，
 *   静态 HTML 直接就是 StaticFallback，零问题。
 */

/**
 * 是否为静态部署模式（4EVERLAND / IPFS）
 * 优先使用构建时烘焙变量，运行时域名检测作为降级
 */
export const isStaticMode = (): boolean => {
  // 优先：构建时烘焙变量（Webpack DefinePlugin 已替换为字面量）
  // SSR 和客户端的值完全一致，避免 hydration 冲突
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') return true

  // 降级：运行时域名检测
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    return host.includes('4everland') || host.includes('ipfs')
  }

  return false
}

/**
 * 静态模式下的 Vercel 管理后台地址
 * 使用构建时烘焙的 NEXT_PUBLIC_VERCEL_URL，与 next.config.js 的 DefinePlugin 保持一致
 * @param path 目标路径，如 '/admin'、'/admin/comments'
 */
export const getVercelAdminUrl = (path: string = '/admin'): string => {
  if (!isStaticMode()) {
    // 在 Vercel 上直接返回相对路径（内部导航）
    return path
  }

  // 使用构建时烘焙的 Vercel URL（DefinePlugin 已替换为字面量）
  const base =
    process.env.NEXT_PUBLIC_VERCEL_URL || 'https://personal-blog.vercel.app'
  return `${base}${path}`
}
