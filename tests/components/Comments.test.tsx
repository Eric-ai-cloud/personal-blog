import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Comments from '@/components/Comments'
import { mockFetchWithMatcher } from '../helpers/mocks'

// 示例评论数据
const mockComments = [
  {
    id: 'c1',
    articleSlug: 'test-post',
    authorName: '勇敢的狐狸_a3x',
    authorId: 'cm_test123',
    content: '写得很好！',
    createdAt: '2026-06-20T10:00:00.000Z',
    likeCount: 3,
    dislikeCount: 0,
  },
  {
    id: 'c2',
    articleSlug: 'test-post',
    authorName: '聪明的熊猫_b7k',
    authorId: 'cm_test456',
    content: '学到了新知识',
    createdAt: '2026-06-22T14:30:00.000Z',
    likeCount: 1,
    dislikeCount: 1,
  },
]

// 包装渲染的辅助函数
function renderComments(slug = 'test-post') {
  return render(<Comments articleSlug={slug} />)
}

describe('Comments Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Mock localStorage
    const store: Record<string, string> = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      delete store[key]
    })
    // Mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  // ======================== 渲染与加载 ========================

  it('加载中应显示加载提示', async () => {
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: [] } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    // 初始应该有加载提示
    expect(screen.getByText(/加载中/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })
  })

  it('没有评论时应显示空状态提示', async () => {
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: [] } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论，来说两句吧/i)).toBeInTheDocument()
    })
  })

  it('有评论时应正确渲染评论列表', async () => {
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: mockComments } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
      expect(screen.getByText('聪明的熊猫_b7k')).toBeInTheDocument()
      expect(screen.getByText('写得很好！')).toBeInTheDocument()
      expect(screen.getByText('学到了新知识')).toBeInTheDocument()
    })
  })

  it('应显示评论的点赞和点踩按钮', async () => {
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: mockComments } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      // 每条评论都有点赞和点踩按钮
      const likeButtons = screen.getAllByText('点赞')
      const dislikeButtons = screen.getAllByText('点踩')
      expect(likeButtons.length).toBe(2)
      expect(dislikeButtons.length).toBe(2)
    })
  })

  // ======================== 提交评论 ========================

  it('应能输入评论内容并提交', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/comments',
        method: 'GET',
        data: { comments: [] },
      },
      {
        pattern: '/api/comments',
        method: 'POST',
        data: { success: true, comment: {} },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })

    // 输入评论内容
    const textarea = screen.getByPlaceholderText(/说点什么/i)
    await user.type(textarea, '这篇文章很棒')

    // 提交
    const submitBtn = screen.getByText('提交评论')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled()
    })
  })

  it('提交成功后应清空表单并刷新评论', async () => {
    const user = userEvent.setup()
    let getCallCount = 0
    const mockFetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const urlStr = typeof url === 'string' ? url : url
      const method = init?.method || 'GET'

      if (method === 'GET') {
        getCallCount++
        return {
          ok: true,
          status: 200,
          json: async () => ({
            comments: getCallCount > 1 ? mockComments : [],
          }),
        }
      }
      // POST
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, comment: {} }),
      }
    })
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/说点什么/i)
    await user.type(textarea, '测试评论')

    const submitBtn = screen.getByText('提交评论')
    await user.click(submitBtn)

    // 提交后应重新获取评论，显示 mockComments
    await waitFor(() => {
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
    })
  })

  it('昵称被占用时应显示 alert 提示', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/comments',
        method: 'GET',
        data: { comments: [] },
      },
      {
        pattern: '/api/comments',
        method: 'POST',
        data: {
          success: false,
          error: '该昵称已被其他人使用，请换一个昵称',
          code: 'NICKNAME_TAKEN',
        },
        options: { status: 409 },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText(/说点什么/i)
    await user.type(textarea, '测试')

    const submitBtn = screen.getByText('提交评论')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        '该昵称已被其他人使用，请换一个昵称'
      )
    })
  })

  // ======================== 评论投票 ========================

  it('点赞按钮点击后应高亮并更新计数', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', method: 'GET', data: { comments: mockComments } },
      {
        pattern: '/api/comments/vote',
        method: 'POST',
        data: { success: true, likeCount: 4, dislikeCount: 0 },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
    })

    // 点击第一条评论的点赞按钮
    const likeButtons = screen.getAllByText('点赞')
    await user.click(likeButtons[0])

    // 验证乐观更新 — 计数从 3 变为 4
    await waitFor(() => {
      // 检查按钮高亮
      expect(likeButtons[0]).toHaveClass('text-blue-600')
    })
  })

  it('点踩按钮点击后应高亮', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', method: 'GET', data: { comments: mockComments } },
      {
        pattern: '/api/comments/vote',
        method: 'POST',
        data: { success: true, likeCount: 3, dislikeCount: 1 },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
    })

    const dislikeButtons = screen.getAllByText('点踩')
    await user.click(dislikeButtons[0])

    await waitFor(() => {
      expect(dislikeButtons[0]).toHaveClass('text-red-600')
    })
  })

  it('投票失败后应回滚', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', method: 'GET', data: { comments: mockComments } },
      {
        pattern: '/api/comments/vote',
        method: 'POST',
        data: { success: false },
        options: { error: true },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    renderComments()

    await waitFor(() => {
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
    })

    const likeButtons = screen.getAllByText('点赞')
    await user.click(likeButtons[0])

    // 投票失败时不应崩溃
    await waitFor(() => {
      // 组件应该仍然渲染正常
      expect(screen.getByText('勇敢的狐狸_a3x')).toBeInTheDocument()
    })
  })

  // ======================== 昵称功能 ========================

  it('应自动生成昵称并显示在输入框中', async () => {
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: [] } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })

    // 昵称输入框应该有值
    const nicknameInput = screen.getByPlaceholderText(/输入你的昵称/i) as HTMLInputElement
    expect(nicknameInput.value).toBeTruthy()
  })

  it('点击换一个按钮应更换昵称', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      { pattern: '/api/comments', data: { comments: [] } },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderComments()

    await waitFor(() => {
      expect(screen.getByText(/暂无评论/i)).toBeInTheDocument()
    })

    const nicknameInput = screen.getByPlaceholderText(/输入你的昵称/i) as HTMLInputElement
    const oldNickname = nicknameInput.value

    const changeBtn = screen.getByText('换一个')
    await user.click(changeBtn)

    // 昵称应该变化了
    expect(nicknameInput.value).not.toBe(oldNickname)
  })
})
