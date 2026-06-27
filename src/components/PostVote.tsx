'use client'

import { useEffect, useState } from 'react'

interface PostVoteProps {
  slug: string
}

// ========== localStorage 投票组件（静态模式使用）==========
function PostVoteStatic({ slug }: PostVoteProps) {
  const storageKey = `post_vote_${slug}`

  interface VoteData {
    likeCount: number
    dislikeCount: number
    userVote: 'like' | 'dislike' | null
  }

  const [voteData, setVoteData] = useState<VoteData>({ likeCount: 0, dislikeCount: 0, userVote: null })

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setVoteData(JSON.parse(stored))
      } catch { /* ignore */ }
    }
  }, [storageKey])

  const handleVote = (action: 'like' | 'dislike') => {
    setVoteData((prev) => {
      const newData: VoteData = { ...prev }
      if (prev.userVote === action) {
        // 撤销
        if (action === 'like') newData.likeCount = Math.max(0, newData.likeCount - 1)
        else newData.dislikeCount = Math.max(0, newData.dislikeCount - 1)
        newData.userVote = null
      } else if (prev.userVote) {
        // 切换
        if (action === 'like') {
          newData.likeCount += 1
          newData.dislikeCount = Math.max(0, newData.dislikeCount - 1)
        } else {
          newData.dislikeCount += 1
          newData.likeCount = Math.max(0, newData.likeCount - 1)
        }
        newData.userVote = action
      } else {
        // 新增
        if (action === 'like') newData.likeCount += 1
        else newData.dislikeCount += 1
        newData.userVote = action
      }
      localStorage.setItem(storageKey, JSON.stringify(newData))
      return { ...newData }
    })
  }

  return (
    <div className="flex items-center gap-4 justify-center py-4 mb-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">这篇文章对你有帮助吗？</span>

      <button
        onClick={() => handleVote('like')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
          voteData.userVote === 'like'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 font-medium'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
        title="有帮助"
      >
        <svg className="w-5 h-5" fill={voteData.userVote === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        点赞
        <span className="text-xs font-medium">{voteData.likeCount}</span>
      </button>

      <button
        onClick={() => handleVote('dislike')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
          voteData.userVote === 'dislike'
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 font-medium'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
        title="没有帮助"
      >
        <svg className="w-5 h-5" fill={voteData.userVote === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        点踩
        <span className="text-xs font-medium">{voteData.dislikeCount}</span>
      </button>
    </div>
  )
}

// 获取或创建评论者 ID
const getOrCreateCommenterId = (): string => {
  if (typeof window === 'undefined') return ''

  // 尝试从 localStorage 读取已有的评论者 ID
  const storedId = localStorage.getItem('blog_commenter_id')
  if (storedId) return storedId

  // 如果没有，生成新的 ID 并存储
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  const newId = `cm_${timestamp}_${randomPart}`
  localStorage.setItem('blog_commenter_id', newId)
  return newId
}

export default function PostVote({ slug }: PostVoteProps) {
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [currentVote, setCurrentVote] = useState<'like' | 'dislike' | null>(null)
  const [loading, setLoading] = useState(true)

  // 加载文章投票数据
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') return
    fetchPostVotes()
  }, [slug])

  // 静态模式：使用 localStorage 纯前端方案
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    return <PostVoteStatic slug={slug} />
  }

  const fetchPostVotes = async () => {
    try {
      const commenterId = getOrCreateCommenterId()
      const response = await fetch(`/api/posts/vote?slug=${slug}`)
      const data = await response.json()
      setLikeCount(data.likeCount || 0)
      setDislikeCount(data.dislikeCount || 0)

      // 检查当前用户是否已投票
      if (commenterId && data.voters) {
        const userVote = data.voters[commenterId]
        if (userVote === 'like' || userVote === 'dislike') {
          setCurrentVote(userVote)
        }
      }
    } catch (error) {
      console.error('获取文章投票数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 投票处理函数
  const handleVote = async (action: 'like' | 'dislike') => {
    const commenterId = getOrCreateCommenterId()
    if (!commenterId) return

    // 保存当前状态用于回滚
    const optimisticLikeCount = likeCount
    const optimisticDislikeCount = dislikeCount
    const optimisticVote = currentVote

    // 乐观更新 UI
    if (currentVote === action) {
      // 撤销
      if (action === 'like') {
        setLikeCount(Math.max(0, likeCount - 1))
      } else {
        setDislikeCount(Math.max(0, dislikeCount - 1))
      }
      setCurrentVote(null)
    } else if (currentVote) {
      // 切换
      if (action === 'like') {
        setLikeCount(likeCount + 1)
        setDislikeCount(Math.max(0, dislikeCount - 1))
      } else {
        setLikeCount(Math.max(0, likeCount - 1))
        setDislikeCount(dislikeCount + 1)
      }
      setCurrentVote(action)
    } else {
      // 新增
      if (action === 'like') {
        setLikeCount(likeCount + 1)
      } else {
        setDislikeCount(dislikeCount + 1)
      }
      setCurrentVote(action)
    }

    try {
      const response = await fetch('/api/posts/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action, commenterId }),
      })

      const result = await response.json()

      if (result.success) {
        // 同步真实数据
        setLikeCount(result.likeCount)
        setDislikeCount(result.dislikeCount)
        setCurrentVote(result.votedAction)
      } else {
        // 失败时回滚
        setLikeCount(optimisticLikeCount)
        setDislikeCount(optimisticDislikeCount)
        setCurrentVote(optimisticVote)
      }
    } catch (error) {
      console.error('投票失败:', error)
      // 失败时回滚
      setLikeCount(optimisticLikeCount)
      setDislikeCount(optimisticDislikeCount)
      setCurrentVote(optimisticVote)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-4 justify-center py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 justify-center py-4 mb-0">
      <span className="text-sm text-gray-600 dark:text-gray-400">这篇文章对你有帮助吗？</span>

      <button
        onClick={() => handleVote('like')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
          currentVote === 'like'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 font-medium'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
        title="有帮助"
      >
        <svg className="w-5 h-5" fill={currentVote === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        点赞
        <span className="text-xs font-medium">{likeCount}</span>
      </button>

      <button
        onClick={() => handleVote('dislike')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
          currentVote === 'dislike'
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 font-medium'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
        title="没有帮助"
      >
        <svg className="w-5 h-5" fill={currentVote === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        点踩
        <span className="text-xs font-medium">{dislikeCount}</span>
      </button>
    </div>
  )
}
