import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchBar } from '@/components/SearchBar'

describe('SearchBar Component', () => {
  const mockOnSearchChange = vi.fn()

  beforeEach(() => {
    mockOnSearchChange.mockClear()
  })

  it('应该渲染搜索输入框', () => {
    render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />)

    const input = screen.getByPlaceholderText(/搜索文章标题/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('应该显示搜索图标', () => {
    render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />)

    const searchInput = screen.getByLabelText(/搜索文章/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('应该响应输入变化并触发防抖回调', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />)

    const input = screen.getByPlaceholderText(/搜索文章标题/i)
    await user.type(input, 'react')

    // 300ms 防抖后触发回调
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockOnSearchChange).toHaveBeenCalledWith('react')
    vi.useRealTimers()
  })

  it('有内容时应该显示清空按钮', () => {
    render(<SearchBar searchQuery="react" onSearchChange={mockOnSearchChange} />)

    const clearButton = screen.getByLabelText(/清空搜索/i)
    expect(clearButton).toBeInTheDocument()
  })

  it('点击清空按钮应该清空搜索', async () => {
    const user = userEvent.setup()
    render(<SearchBar searchQuery="react" onSearchChange={mockOnSearchChange} />)

    const clearButton = screen.getByLabelText(/清空搜索/i)
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)

    expect(mockOnSearchChange).toHaveBeenCalledWith('')
  })

  it('没有内容时不应该显示清空按钮', () => {
    render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />)

    expect(screen.queryByLabelText(/清空搜索/i)).not.toBeInTheDocument()
  })

  it('应该同步外部 searchQuery 变化', () => {
    const { rerender } = render(
      <SearchBar searchQuery="old" onSearchChange={mockOnSearchChange} />
    )

    rerender(<SearchBar searchQuery="new" onSearchChange={mockOnSearchChange} />)

    const input = screen.getByPlaceholderText(/搜索文章标题/i) as HTMLInputElement
    expect(input.value).toBe('new')
  })

  it('应该显示快捷键提示', () => {
    render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />)

    expect(screen.getByText('Ctrl+K')).toBeInTheDocument()
  })

  it('有内容时应该显示 ESC 快捷键提示', () => {
    render(<SearchBar searchQuery="test" onSearchChange={mockOnSearchChange} />)

    expect(screen.getByText('ESC')).toBeInTheDocument()
  })
})
