/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  
  // MDX 配置
  pageExtensions: ['ts', 'tsx', 'mdx'],
  
  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
