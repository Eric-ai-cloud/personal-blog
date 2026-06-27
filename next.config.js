/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启静态导出，替代原来的next export
  output: 'export',

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
