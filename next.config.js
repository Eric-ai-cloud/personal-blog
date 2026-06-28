// 通过环境变量控制是否启用静态导出
// 4EVERLAND部署时设置 NEXT_STATIC_EXPORT=true
// Vercel部署时不设置，保持SSR模式
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true'
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://personal-blog.vercel.app'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 配置选项
  reactStrictMode: true,

  // 启用 URL 尾部斜杠，静态导出时生成 /admin/index.html 而非 /admin.html
  // 这样 4EVERLAND/IPFS 才能正确解析 /admin/ → admin/index.html
  trailingSlash: true,

  // 静态导出配置（仅4EVERLAND启用）
  ...(isStaticExport ? { output: 'export' } : {}),

  // 通过 webpack DefinePlugin 强制内联变量
  // 确保变量在客户端代码中一定被替换为正确的值
  webpack: (config) => {
    const { DefinePlugin } = require('webpack')
    config.plugins.push(
      new DefinePlugin({
        // 强制替换所有组件中的静态模式检测
        'process.env.NEXT_PUBLIC_STATIC_EXPORT': JSON.stringify(
          isStaticExport ? 'true' : 'false'
        ),
        'process.env.NEXT_PUBLIC_VERCEL_URL': JSON.stringify(vercelUrl),
      })
    )
    return config
  },

  // MDX 配置
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // 优化图片（静态导出时需禁用优化）
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
}

module.exports = nextConfig
