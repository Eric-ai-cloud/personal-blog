'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

interface Comment {
  id: string
  articleSlug: string
  authorName: string
  authorId?: string  // 评论者唯一 ID
  content: string
  createdAt: string
  likeCount: number
  dislikeCount: number
}

interface CommentsProps {
  articleSlug: string
}

// ========== Giscus 评论组件（静态模式使用）==========
function GiscusComments({ articleSlug }: { articleSlug: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', process.env.NEXT_PUBLIC_GISCUS_REPO || 'Eric-ai-cloud/personal-blog')
    script.setAttribute('data-repo-id', process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '')
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', articleSlug)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    ref.current.appendChild(script)
  }, [articleSlug])

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">评论</h2>
      {/* Giscus 未配置时的占位提示 */}
      {(!process.env.NEXT_PUBLIC_GISCUS_REPO_ID || !process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID) && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
          评论系统尚未配置。请在 4EVERLAND 环境变量中设置 NEXT_PUBLIC_GISCUS_REPO_ID 和 NEXT_PUBLIC_GISCUS_CATEGORY_ID。
        </div>
      )}
      <div ref={ref} className="min-h-[200px]" />
    </div>
  )
}

// 趣味形容词前缀
const ADJECTIVES = [
  '快乐的', '好奇的', '安静的', '勇敢的', '温柔的',
  '聪明的', '自由的', '温暖的', '神秘的', '有趣的',
  '潇洒的', '酷酷的', '可爱的', '淡定的', '热情的',
  '优雅的', '幽默的', '浪漫的', '天真的', '睿智的',
]

// 趣味名词后缀
const NOUNS = [
  '小猫', '小狗', '兔子', '狐狸', '熊猫',
  '海豚', '企鹅', '松鼠', '考拉', '仓鼠',
  '星星', '月亮', '太阳', '云朵', '微风',
  '旅人', '诗人', '画家', '侦探', '船长',
]

// 生成随机昵称
const generateNickname = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const suffix = Math.random().toString(36).substring(2, 5)
  return `${adj}${noun}_${suffix}`
}

// 生成唯一评论者 ID
const generateCommenterId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `cm_${timestamp}_${randomPart}`
}

// 获取或创建评论者 ID
const getOrCreateCommenterId = (): string => {
  if (typeof window === 'undefined') return ''

  const storedId = localStorage.getItem('blog_commenter_id')
  if (storedId) return storedId

  const newId = generateCommenterId()
  localStorage.setItem('blog_commenter_id', newId)
  return newId
}

// 获取或创建自动昵称
const getOrCreateNickname = (): string => {
  if (typeof window === 'undefined') return generateNickname()

  const savedNickname = localStorage.getItem('blog_comment_nickname')
  if (savedNickname) return savedNickname

  const newNickname = generateNickname()
  localStorage.setItem('blog_comment_nickname', newNickname)
  return newNickname
}

export default function Comments({ articleSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentNickname, setCurrentNickname] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // 更换昵称（必须在条件返回之前调用）
  const handleChangeNickname = useCallback(() => {
    const newNickname = generateNickname()
    localStorage.setItem('blog_comment_nickname', newNickname)
    setCurrentNickname(newNickname)
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${articleSlug}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('获取评论失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载评论和自动昵称
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') return
    fetchComments()

    // 自动生成或读取昵称
    const nickname = getOrCreateNickname()
    setCurrentNickname(nickname)
  }, [articleSlug])

  // 静态模式：使用 Giscus
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    return <GiscusComments articleSlug={articleSlug} />
  }

  // 提交评论
  const onSubmit = async (data: any) => {
    // 校验昵称不为空
    const nickname = currentNickname.trim()
    if (!nickname) {
      alert('请填写昵称')
      return
    }

    setSubmitting(true)
    try {
      const commenterId = getOrCreateCommenterId()

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          authorName: nickname,
          authorId: commenterId,
          content: data.content,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // 保存昵称到 localStorage
        localStorage.setItem('blog_comment_nickname', nickname)
        setCurrentNickname(nickname)
        reset()
        fetchComments()
      } else if (result.code === 'NICKNAME_TAKEN') {
        // 昵称被占用，提示用户更换
        alert('该昵称已被其他人使用，请换一个昵称')
      } else {
        alert('提交失败：' + result.error)
      }
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 投票处理函数
  const handleVote = async (commentId: string, action: 'like' | 'dislike') => {
    const commenterId = typeof window !== 'undefined' ? getOrCreateCommenterId() : null
    if (!commenterId) return

    // 读取当前投票状态
    const currentVote = getUserVote(commentId)

    // 计算乐观更新的目标状态
    let optimisticVote: 'like' | 'dislike' | null = currentVote === action ? null : action

    // 乐观更新 UI：更新 localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${commentId}:like`)
      localStorage.removeItem(`${commentId}:dislike`)
      if (optimisticVote) {
        localStorage.setItem(`${commentId}:${optimisticVote}`, 'true')
      }
    }

    // 乐观更新评论计数
    const optimisticLikeCount = comments.find((c) => c.id === commentId)?.likeCount ?? 0
    const optimisticDislikeCount = comments.find((c) => c.id === commentId)?.dislikeCount ?? 0

    if (currentVote === action) {
      // 撤销
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, [action + 'Count']: Math.max(0, c[action as 'likeCount' | 'dislikeCount'] - 1) }
            : c
        )
      )
    } else if (currentVote) {
      // 切换：旧票减一，新票加一
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likeCount: action === 'like' ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
                dislikeCount: action === 'dislike' ? c.dislikeCount + 1 : Math.max(0, c.dislikeCount - 1),
              }
            : c
        )
      )
    } else {
      // 没投过：直接加一
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, [action + 'Count']: c[action as 'likeCount' | 'dislikeCount'] + 1 } : c
        )
      )
    }

    // 发送请求到后端持久化 — 后端根据用户的已投票状态判断是新增、切换还是撤销
    try {
      const response = await fetch('/api/comments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          action,
          authorId: commenterId,
          authorName: currentNickname,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // 将服务器返回的真实计数同步回 state
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likeCount: result.likeCount, dislikeCount: result.dislikeCount }
              : c
          )
        )
      } else {
        // 失败时恢复：回滚 localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`${commentId}:like`)
          localStorage.removeItem(`${commentId}:dislike`)
          if (currentVote) {
            localStorage.setItem(`${commentId}:${currentVote}`, 'true')
          }
        }
        // 恢复计数
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likeCount: optimisticLikeCount, dislikeCount: optimisticDislikeCount }
              : c
          )
        )
      }
    } catch (error) {
      console.error('投票失败:', error)
      // 失败时恢复：回滚 localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${commentId}:like`)
        localStorage.removeItem(`${commentId}:dislike`)
        if (currentVote) {
          localStorage.setItem(`${commentId}:${currentVote}`, 'true')
        }
      }
      // 恢复计数
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likeCount: optimisticLikeCount, dislikeCount: optimisticDislikeCount }
            : c
        )
      )
    }
  }

  // 检查用户是否对某条评论有投票记录
  const getUserVote = (commentId: string): 'like' | 'dislike' | null => {
    if (typeof window === 'undefined') return null
    const likedKey = `${commentId}:like`
    const dislikedKey = `${commentId}:dislike`
    if (localStorage.getItem(likedKey) === 'true') return 'like'
    if (localStorage.getItem(dislikedKey) === 'true') return 'dislike'
    return null
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        评论 ({comments.length})
      </h2>

      {/* 评论列表 */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无评论，来说两句吧~</p>
      ) : (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => {
            const vote = getUserVote(comment.id)
            const isLikeActive = vote === 'like'
            const isDislikeActive = vote === 'dislike'

            return (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.authorName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>

                {/* 点赞点踩按钮 */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(comment.id, 'like')}
                    className={`flex items-center gap-1.5 text-sm transition ${
                      isLikeActive
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                    }`}
                    title="赞同"
                  >
                    <svg className="w-4 h-4" fill={isLikeActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    点赞
                    <span className="text-xs">{comment.likeCount}</span>
                  </button>
                  <button
                    onClick={() => handleVote(comment.id, 'dislike')}
                    className={`flex items-center gap-1.5 text-sm transition ${
                      isDislikeActive
                        ? 'text-red-600 dark:text-red-400 font-medium'
                        : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
                    }`}
                    title="不认同"
                  >
                    <svg className="w-4 h-4" fill={isDislikeActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    点踩
                    <span className="text-xs">{comment.dislikeCount}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 评论表单 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 昵称输入区 */}
        <div>
          <label
            htmlFor="nickname-input"
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            昵称
            <span className="text-xs text-gray-400 ml-2">（默认自动生成，可手动修改）</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="nickname-input"
              type="text"
              value={currentNickname}
              onChange={(e) => setCurrentNickname(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="输入你的昵称"
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleChangeNickname}
              className="shrink-0 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 rounded-lg transition-colors"
              title="随机换一个昵称"
            >
              换一个
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            评论内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('content', { required: '请填写评论内容' })}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="说点什么..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {(errors.content.message as string) || '必填'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '提交中...' : '提交评论'}
        </button>
      </form>
    </div>
  )
}
