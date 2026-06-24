import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TagFilter } from '@/components/TagFilter'

describe('TagFilter Component', () => {
  const mockTags = ['react', 'typescript', 'nextjs', 'tailwind']
  const mockOnTagChange = vi.fn()

  beforeEach(() => {
    mockOnTagChange.mockClear()
  })

  it('应该渲染所有标签', () => {
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
    expect(screen.getByText('tailwind')).toBeInTheDocument()
  })

  it('应该显示"全部"选项', () => {
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    expect(screen.getByText(/all|全部/i)).toBeInTheDocument()
  })

  it('点击标签应该触发回调', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    await user.click(screen.getByText('react'))
    
    expect(mockOnTagChange).toHaveBeenCalledWith('react')
  })

  it('点击"全部"应该清除筛选', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={mockTags} selectedTag="react" onTagChange={mockOnTagChange} />)
    
    await user.click(screen.getByText(/all|全部/i))
    
    expect(mockOnTagChange).toHaveBeenCalledWith(undefined)
  })

  it('应该高亮选中的标签', () => {
    render(<TagFilter tags={mockTags} selectedTag="react" onTagChange={mockOnTagChange} />)
    
    const selectedTag = screen.getByText('react')
    // 应该有某种高亮样式
    expect(selectedTag).toHaveClass('bg-blue-500')
  })

  it('应该正确处理空标签数组', () => {
    render(<TagFilter tags={[]} onTagChange={mockOnTagChange} />)
    
    // 至少应该显示"全部"选项
    expect(screen.getByText(/all|全部/i)).toBeInTheDocument()
  })

  it('应该支持键盘导航', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    const reactTag = screen.getByText('react')
    await user.tab() // Tab 到第一个标签
    await user.keyboard('{Enter}') // 按 Enter
    
    expect(mockOnTagChange).toHaveBeenCalled()
  })

  it('应该有正确的 ARIA labels', () => {
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    const tagList = screen.getByRole('list')
    expect(tagList).toHaveAttribute('aria-label', 'Tags filter')
  })
})
