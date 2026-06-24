import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogCard } from '@/components/BlogCard'

describe('BlogCard Component', () => {
  const mockProps = {
    post: {
      slug: 'test-post',
      title: 'Test Post Title',
      description: 'This is a test description for the blog post',
      date: '2024-01-15',
      tags: ['react', 'typescript'],
      readingTime: 5,
    },
  }

  it('应该正确渲染文章卡片', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test description for the blog post')).toBeInTheDocument()
  })

  it('应该显示标签', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#typescript')).toBeInTheDocument()
  })

  it('应该显示阅读时间', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument()
  })

  it('应该显示格式化后的日期', () => {
    render(<BlogCard {...mockProps} />)
    
    // 应该包含年份
    expect(screen.getByText(/2024/i)).toBeInTheDocument()
  })

  it('点击标题应该导航到文章详情', () => {
    render(<BlogCard {...mockProps} />)
    
    const link = screen.getByRole('link', { name: /test post title/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog/test-post')
  })

  it('应该处理没有标签的情况', () => {
    const propsWithoutTags = {
      ...mockProps,
      post: { ...mockProps.post, tags: undefined },
    }
    render(<BlogCard {...propsWithoutTags} />)
    
    // 不应该显示任何标签
    expect(screen.queryByText(/#\w+/)).not.toBeInTheDocument()
  })

  it('应该处理很长的标题和描述', () => {
    const longTitle = 'A'.repeat(100)
    const longDescription = 'B'.repeat(200)
    
    const propsWithLongContent = {
      ...mockProps,
      post: {
        ...mockProps.post,
        title: longTitle,
        description: longDescription,
      },
    }
    
    render(<BlogCard {...propsWithLongContent} />)
    
    expect(screen.getByText(longTitle)).toBeInTheDocument()
    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })

  it('应该处理空描述', () => {
    const propsWithoutDesc = {
      ...mockProps,
      post: { ...mockProps.post, description: '' },
    }
    render(<BlogCard {...propsWithoutDesc} />)
    
    // 不应该抛出错误
    expect(screen.getByText(mockProps.post.title)).toBeInTheDocument()
  })
})
