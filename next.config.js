// 通过环境变量控制是否启用静态导出
// 4EVERLAND部署时设置 NEXT_STATIC_EXPORT=true
// Vercel部署时不设置，保持SSR模式
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 配置选项
  reactStrictMode: true,

  // 静态导出配置（仅4EVERLAND启用）
  ...(isStaticExport ? { output: 'export' } : {}),

  // MDX 配置
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // 优化图片（静态导出时需禁用优化）
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
}

module.exports = nextConfig
