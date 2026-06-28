'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isStaticMode } from '@/lib/static-mode'
import StaticFallback from '@/components/admin/StaticFallback'

interface Comment {
  id: string
  articleSlug: string
  authorName: string
  authorId?: string
  content: string
  createdAt: string
  likeCount: number
  dislikeCount: number
}

interface Commenter {
  id: string
  name: string
  firstCommentAt: string
  lastCommentAt: string
  commentCount: number
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [commenters, setCommenters] = useState<Commenter[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSlug, setFilterSlug] = useState<string | undefined>()
  const [filterCommenterId, setFilterCommenterId] = useState<string | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showCommenters, setShowCommenters] = useState(false)

  // 加载评论和评论者
  useEffect(() => {
    if (isStaticMode()) return
    fetchComments()
    fetchCommenters()
  }, [filterSlug, filterCommenterId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      let url = '/api/comments'
      const params = new URLSearchParams()
      if (filterSlug) params.append('slug', filterSlug)
      if (filterCommenterId) params.append('commenterId', filterCommenterId)

      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('获取评论失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommenters = async () => {
    try {
      const response = await fetch('/api/commenters')
      const data = await response.json()
      setCommenters(data.commenters || [])
    } catch (error) {
      console.error('获取评论者失败:', error)
    }
  }

  // 删除评论
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchComments()
        fetchCommenters()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    } finally {
      setDeletingId(null)
    }
  }

  // 删除评论者（删除该评论者的所有评论）
  const handleDeleteCommenter = async (commenterId: string) => {
    if (!confirm('确定要删除该评论者的所有评论吗？此操作不可恢复！')) return

    try {
      const response = await fetch(`/api/commenters?id=${commenterId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchComments()
        fetchCommenters()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
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

  // 提取唯一文章 slug 列表
  const uniqueSlugs = [...new Set(comments.map((c) => c.articleSlug))]

  if (isStaticMode()) {
    return <StaticFallback adminPath="/admin/comments/" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            评论管理
          </h1>
          <Link
            href="/admin"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            ← 返回
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 筛选器 */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                按文章筛选
              </label>
              <select
                value={filterSlug || ''}
                onChange={(e) => setFilterSlug(e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">全部文章</option>
                {uniqueSlugs.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                按评论者筛选
              </label>
              <select
                value={filterCommenterId || ''}
                onChange={(e) => setFilterCommenterId(e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">全部评论者</option>
                {commenters.map((commenter) => (
                  <option key={commenter.id} value={commenter.id}>
                    {commenter.name} ({commenter.commentCount} 条评论)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            {(filterSlug || filterCommenterId) && (
              <button
                onClick={() => {
                  setFilterSlug(undefined)
                  setFilterCommenterId(undefined)
                }}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                清除筛选
              </button>
            )}
            <button
              onClick={() => setShowCommenters(!showCommenters)}
              className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
            >
              {showCommenters ? '隐藏评论者列表' : '显示评论者列表'}
            </button>
          </div>
        </div>

        {/* 评论者管理面板 */}
        {showCommenters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              评论者管理 ({commenters.length} 人)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">评论者 ID</th>
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">昵称</th>
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">评论数</th>
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">首次评论</th>
                    <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">最后评论</th>
                    <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {commenters.map((commenter) => (
                    <tr key={commenter.id} className="border-b dark:border-gray-700">
                      <td className="py-2 px-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {commenter.id.slice(0, 16)}...
                      </td>
                      <td className="py-2 px-3 text-gray-900 dark:text-white">
                        {commenter.name}
                      </td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                        {commenter.commentCount}
                      </td>
                      <td className="py-2 px-3 text-gray-500 dark:text-gray-400">
                        {formatDate(commenter.firstCommentAt)}
                      </td>
                      <td className="py-2 px-3 text-gray-500 dark:text-gray-400">
                        {formatDate(commenter.lastCommentAt)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => setFilterCommenterId(commenter.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3"
                          title="查看该评论者的评论"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleDeleteCommenter(commenter.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                          title="删除该评论者的所有评论"
                        >
                          删除全部
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {commenters.length === 0 && (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">暂无评论者</p>
              )}
            </div>
          </div>
        )}

        {/* 评论列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无评论</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.authorName}
                      </span>
                      {comment.authorId && (
                        <span
                          className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-200 cursor-pointer hover:bg-purple-200"
                          onClick={() => setFilterCommenterId(comment.authorId)}
                          title="点击筛选该评论者的评论"
                        >
                          ID: {comment.authorId.slice(0, 12)}...
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200 truncate">
                        {comment.articleSlug}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 break-words">
                      {comment.content}
                    </p>
                    {/* 点赞点踩计数 */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className={`flex items-center gap-1 ${
                        comment.likeCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        <svg className="w-4 h-4" fill={comment.likeCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        点赞 {comment.likeCount}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        comment.dislikeCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        <svg className="w-4 h-4" fill={comment.dislikeCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        点踩 {comment.dislikeCount}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded transition shrink-0 disabled:opacity-50"
                  >
                    {deletingId === comment.id ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
