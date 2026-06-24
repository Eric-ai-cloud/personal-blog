// Mock 文章数据
export const mockPosts = [
  {
    slug: 'first-post',
    title: '我的第一篇文章',
    description: '这是博客的第一篇文章，介绍博客的初衷和愿景',
    date: '2024-01-01',
    tags: ['intro', 'welcome'],
    published: true,
  },
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
    slug: 'draft-post',
    title: '草稿文章',
    description: '这是一篇未发布的文章',
    date: '2024-02-15',
    tags: ['draft'],
    published: false,
  },
]

// Mock 用户数据
export const mockUsers = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  },
]

// Mock 搜索结果
export const mockSearchResults = [
  {
    slug: 'react-hooks-guide',
    title: 'React Hooks 完全指南',
    excerpt: '深入学习 <mark>React</mark> Hooks 的使用和最佳实践',
    score: 0.95,
    matchedFields: ['title', 'description'],
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 实用技巧',
    excerpt: 'TypeScript 开发中的实用技巧和常见误区',
    score: 0.75,
    matchedFields: ['description'],
  },
]
