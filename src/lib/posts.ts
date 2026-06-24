import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, Frontmatter } from '@/types'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

/**
 * 获取所有博客文章
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        createdDate: data.createdDate || data.date || '',
        publishedDate: data.publishedDate || data.date || '',
        tags: data.tags || [],
        published: data.published ?? false,
      } as BlogPost
    })

  // 按发布日期倒序排列
  return allPosts.sort((a, b) => new Date(b.publishedDate || b.date).getTime() - new Date(a.publishedDate || a.date).getTime())
}

/**
 * 获取排序后的文章（按日期倒序）
 */
export function getSortedPosts(): BlogPost[] {
  return getAllPosts()
}

/**
 * 获取所有标签
 */
export function getTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()

  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag))
    }
  })

  return Array.from(tagSet).sort()
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts()
  return posts.filter(post => post.tags?.includes(tag))
}

/**
 * 根据 slug 获取单篇文章
 */
export function getPostBySlug(slug: string): { content: string; data: Frontmatter } | null {
  try {
    // 解码 URL 编码的中文 slug（如 %E5%9B%BE → 图）
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(postsDirectory, `${decodedSlug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      content,
      data: {
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        createdDate: data.createdDate || data.date || '',
        publishedDate: data.publishedDate || data.date || '',
        tags: data.tags || [],
        published: data.published ?? false,
      } as Frontmatter,
    }
  } catch (error) {
    return null
  }
}
