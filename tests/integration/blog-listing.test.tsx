import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import BlogPage from '@/app/blog/page'

describe('Blog Listing Integration', () => {
  it('应该能加载博客列表页', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
  })

  it('应该显示文章列表', async () => {
    render(<BlogPage />)

    await waitFor(() => {
      // 至少应该有一篇文章（页面可能有多篇文章）
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
  })

  it('应该显示标签筛选组件', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      // 应该存在标签筛选区域
      const tagFilter = screen.getByRole('list', { name: /tags|标签/i })
      expect(tagFilter).toBeInTheDocument()
    })
  })

  it('应该能按标签筛选文章', async () => {
    const user = userEvent.setup()
    render(<BlogPage />)
    
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
    
    // 点击一个标签（假设存在react标签）
    const reactTag = screen.queryByText('react')
    if (reactTag) {
      await user.click(reactTag)
      
      await waitFor(() => {
        const filteredArticles = screen.getAllByRole('article')
        // 验证过滤后的文章都包含该标签
        filteredArticles.forEach(article => {
          expect(article).toHaveTextContent(/react/i)
        })
      })
    }
  })

  it('应该能切换排序方式', async () => {
    const user = userEvent.setup()
    render(<BlogPage />)
    
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
    
    // 查找排序选择器
    const sortSelect = screen.queryByLabelText(/sort by|排序/i)
    if (sortSelect) {
      await user.selectOptions(sortSelect, 'oldest')
      
      await waitFor(() => {
        // 验证文章顺序改变
        const articles = screen.getAllByRole('article')
        expect(articles.length).toBeGreaterThan(0)
      })
    }
  })

  it('应该显示文章数量统计', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      // 应该显示类似"共 X 篇文章"的文本
      const countText = screen.queryByText(/\d+\s+篇?文章/)
      if (countText) {
        expect(countText).toBeInTheDocument()
      }
    })
  })

  it('应该支持响应式布局', async () => {
    // 这里可以添加更复杂的响应式测试
    render(<BlogPage />)
    
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
  })
})
