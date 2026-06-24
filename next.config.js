/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 配置选项
  reactStrictMode: true,
  
  // MDX 配置
  pageExtensions: ['ts', 'tsx', 'mdx'],
  
  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
