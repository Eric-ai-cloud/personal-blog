import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PostVote from '@/components/PostVote'
import { mockFetchWithMatcher } from '../helpers/mocks'

function renderPostVote(slug = 'test-post') {
  return render(<PostVote slug={slug} />)
}

describe('PostVote Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Mock localStorage
    const store: Record<string, string> = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value
    })
  })

  // ======================== 渲染与加载 ========================

  it('加载中应显示加载提示', () => {
    const mockFetch = vi.fn().mockImplementation(
      () =>
        new Promise(() => {
          /* 永不 resolve，保持加载状态 */
        })
    )
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    expect(screen.getByText(/加载中/i)).toBeInTheDocument()
  })

  it('加载完成后应显示点赞和点踩按钮', async () => {
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        data: { likeCount: 5, dislikeCount: 2, voters: {} },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('点赞')).toBeInTheDocument()
      expect(screen.getByText('点踩')).toBeInTheDocument()
    })
  })

  it('应显示正确的赞踩计数', async () => {
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        data: { likeCount: 10, dislikeCount: 3, voters: {} },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  // ======================== 投票交互 ========================

  it('点击点赞按钮应乐观更新计数', async () => {
    const user = userEvent.setup()
    let postCalled = false
    const mockFetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const urlStr = typeof url === 'string' ? url : url
      const method = init?.method || 'GET'

      if (method === 'POST') {
        postCalled = true
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, likeCount: 6, dislikeCount: 2, votedAction: 'like' }),
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ likeCount: 5, dislikeCount: 2, voters: {} }),
      }
    })
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    const likeBtn = screen.getByText('点赞')
    await user.click(likeBtn)

    // 乐观更新：计数立即从 5 变为 6
    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument()
    })
    expect(postCalled).toBe(true)
  })

  it('点击点踩按钮应乐观更新计数', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        method: 'GET',
        data: { likeCount: 5, dislikeCount: 2, voters: {} },
      },
      {
        pattern: '/api/posts/vote',
        method: 'POST',
        data: { success: true, likeCount: 5, dislikeCount: 3, votedAction: 'dislike' },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    const dislikeBtn = screen.getByText('点踩')
    await user.click(dislikeBtn)

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('重复点击相同按钮应撤销投票', async () => {
    const user = userEvent.setup()
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        method: 'GET',
        data: { likeCount: 5, dislikeCount: 2, voters: {} },
      },
      {
        pattern: '/api/posts/vote',
        method: 'POST',
        data: { success: true, likeCount: 6, dislikeCount: 2, votedAction: 'like' },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    // 点击点赞
    const likeBtn = screen.getByText('点赞')
    await user.click(likeBtn)

    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument()
    })

    // 更新 mock 以模拟撤销
    const mockFetch2 = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        method: 'POST',
        data: { success: true, likeCount: 5, dislikeCount: 2, votedAction: null },
      },
    ])
    vi.stubGlobal('fetch', mockFetch2)

    // 再次点击点赞以撤销
    await user.click(likeBtn)
  })

  it('投票失败后应回滚', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const urlStr = typeof url === 'string' ? url : url
      const method = init?.method || 'GET'

      if (method === 'POST') {
        return {
          ok: false,
          status: 500,
          json: async () => ({ success: false }),
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ likeCount: 5, dislikeCount: 2, voters: {} }),
      }
    })
    vi.stubGlobal('fetch', mockFetch)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    const dislikeBtn = screen.getByText('点踩')
    await user.click(dislikeBtn)

    // 回滚后计数应恢复为 2
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  // ======================== 已投票状态 ========================

  it('已点赞的用户应看到按钮高亮', async () => {
    const commenterId = 'cm_test789'
    localStorage.setItem('blog_commenter_id', commenterId)

    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        data: {
          likeCount: 5,
          dislikeCount: 2,
          voters: { [commenterId]: 'like' },
        },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      const likeBtn = screen.getByText('点赞')
      expect(likeBtn).toHaveClass('text-blue-600')
    })
  })

  it('提示文字应正确显示', async () => {
    const mockFetch = mockFetchWithMatcher([
      {
        pattern: '/api/posts/vote',
        data: { likeCount: 0, dislikeCount: 0, voters: {} },
      },
    ])
    vi.stubGlobal('fetch', mockFetch)

    renderPostVote()

    await waitFor(() => {
      expect(screen.getByText(/这篇文章对你有帮助吗/i)).toBeInTheDocument()
    })
  })
})
