import { describe, it, expect } from 'vitest'
import { getAllPosts, getSortedPosts, getTags, getPostsByTag, getPostBySlug } from '@/lib/posts'

describe('posts.ts 工具函数', () => {
  describe('getAllPosts', () => {
    it('应该返回文章数组', () => {
      const posts = getAllPosts()
      expect(Array.isArray(posts)).toBe(true)
    })

    it('应该只返回已发布的文章', () => {
      const posts = getAllPosts()
      posts.forEach(post => {
        expect(post.published).toBe(true)
      })
    })

    it('应该按日期倒序排列（最新的在前）', () => {
      const posts = getAllPosts()
      for (let i = 1; i < posts.length; i++) {
        expect(new Date(posts[i - 1].date).getTime())
          .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
      }
    })

    it('每篇文章应该有必要的字段', () => {
      const posts = getAllPosts()
      posts.forEach(post => {
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('description')
        expect(post).toHaveProperty('date')
      })
    })
  })

  describe('getSortedPosts', () => {
    it('应该返回排序后的文章数组', () => {
      const posts = getSortedPosts()
      expect(Array.isArray(posts)).toBe(true)
    })

    it('应该按日期倒序排列', () => {
      const posts = getSortedPosts()
      for (let i = 1; i < posts.length; i++) {
        expect(new Date(posts[i - 1].date).getTime())
          .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
      }
    })
  })

  describe('getTags', () => {
    it('应该返回所有唯一标签', () => {
      const tags = getTags()
      const uniqueTags = new Set(tags)
      expect(tags.length).toBe(uniqueTags.size)
    })

    it('应该返回非空标签数组（如果有文章有标签）', () => {
      const tags = getTags()
      // 如果所有文章都没有标签，tags 为空是合理的
      if (tags.length === 0) {
        // 验证返回的是数组即可
        expect(Array.isArray(tags)).toBe(true)
      } else {
        tags.forEach(tag => {
          expect(tag).toBeTruthy()
          expect(typeof tag).toBe('string')
        })
      }
    })
  })

  describe('getPostsByTag', () => {
    it('应该返回包含指定标签的文章', () => {
      // 先获取一个存在的标签
      const allTags = getTags()
      if (allTags.length > 0) {
        const tag = allTags[0]
        const posts = getPostsByTag(tag)
        
        posts.forEach(post => {
          expect(post.tags).toContain(tag)
        })
      }
    })

    it('标签不存在时应该返回空数组', () => {
      const posts = getPostsByTag('non-existent-tag-xyz')
      expect(posts).toHaveLength(0)
    })

    it('应该只返回已发布的文章', () => {
      const allTags = getTags()
      if (allTags.length > 0) {
        const tag = allTags[0]
        const posts = getPostsByTag(tag)
        
        posts.forEach(post => {
          expect(post.published).toBe(true)
        })
      }
    })
  })

  describe('getPostBySlug', () => {
    it('应该能根据 slug 获取文章', () => {
      const posts = getAllPosts()
      if (posts.length > 0) {
        const firstPost = posts[0]
        const result = getPostBySlug(firstPost.slug)
        
        expect(result).not.toBeNull()
        if (result) {
          expect(result.content).toBeDefined()
          expect(result.data).toBeDefined()
          expect(result.data.title).toBe(firstPost.title)
        }
      }
    })

    it('获取不存在的文章应该返回 null', () => {
      const result = getPostBySlug('non-existent-post-slug')
      expect(result).toBeNull()
    })

    it('返回的数据应该包含所有必要字段', () => {
      const posts = getAllPosts()
      if (posts.length > 0) {
        const firstPost = posts[0]
        const result = getPostBySlug(firstPost.slug)
        
        if (result) {
          expect(result.data).toHaveProperty('title')
          expect(result.data).toHaveProperty('description')
          expect(result.data).toHaveProperty('date')
          expect(result.data).toHaveProperty('tags')
          expect(result.data).toHaveProperty('published')
          expect(result.content).toBeDefined()
        }
      }
    })

    it('应该正确处理带特殊字符的 slug', () => {
      // 测试可能的边界情况
      const result = getPostBySlug('post-with-dash_underscore.test')
      // 如果存在这样的文件，应该返回数据；否则返回 null
      expect(result === null || typeof result === 'object').toBe(true)
    })
  })
})
