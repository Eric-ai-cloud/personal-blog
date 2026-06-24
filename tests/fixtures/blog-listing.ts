import type { BlogPost } from '@/types'

// Mock 文章数据 - 用于测试
export const mockPosts: BlogPost[] = [
  {
    slug: 'react-hooks-guide',
    title: 'React Hooks 完全指南',
    description: '深入学习 React Hooks 的使用和最佳实践',
    date: '2024-01-15',
    tags: ['react', 'hooks', 'frontend'],
    published: true,
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 实用技巧',
    description: 'TypeScript 开发中的实用技巧和常见误区',
    date: '2024-02-01',
    tags: ['typescript', 'tips'],
    published: true,
  },
  {
    slug: 'nextjs-app-router',
    title: 'Next.js App Router 深度解析',
    description: '全面了解 Next.js 14 的 App Router 特性',
    date: '2024-02-15',
    tags: ['nextjs', 'react', 'app-router'],
    published: true,
  },
  {
    slug: 'tailwind-css-tricks',
    title: 'Tailwind CSS 实用技巧',
    description: '使用 Tailwind CSS 快速构建现代化界面',
    date: '2024-03-01',
    tags: ['tailwind', 'css', 'frontend'],
    published: true,
  },
  {
    slug: 'draft-post',
    title: '草稿文章',
    description: '这是一篇未发布的文章',
    date: '2024-03-15',
    tags: ['draft'],
    published: false,
  },
]

// 所有可用的标签列表
export const allTags = ['react', 'hooks', 'frontend', 'typescript', 'tips', 'nextjs', 'app-router', 'tailwind', 'css', 'draft']

// 按标签分类的文章
export const postsByTag = {
  'react': [mockPosts[0], mockPosts[2]],
  'typescript': [mockPosts[1]],
  'nextjs': [mockPosts[2]],
  'tailwind': [mockPosts[3]],
  'frontend': [mockPosts[0], mockPosts[3]],
  'hooks': [mockPosts[0]],
  'tips': [mockPosts[1]],
  'app-router': [mockPosts[2]],
  'css': [mockPosts[3]],
  'draft': [mockPosts[4]],
}
