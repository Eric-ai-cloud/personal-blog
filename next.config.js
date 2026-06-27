/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 加上这一行，替代旧版 next export 命令
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
