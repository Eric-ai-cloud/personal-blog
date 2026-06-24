import type { Metadata } from 'next'
import { getAllPosts, getTags } from '@/lib/posts'
import BlogClientPage from './BlogClientPage'

export const metadata: Metadata = {
  title: '博客文章',
  description: '查看所有技术文章和分享',
  openGraph: {
    title: '博客文章 | 我的个人博客',
    description: '查看所有技术文章和分享',
  },
  twitter: {
    card: 'summary_large_image',
    title: '博客文章 | 我的个人博客',
    description: '查看所有技术文章和分享',
  },
}

export default function BlogPage() {
  const allPosts = getAllPosts().filter(post => post.published)
  const tags = getTags()

  return <BlogClientPage allPosts={allPosts} tags={tags} />
}
