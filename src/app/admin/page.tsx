'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { SearchBar } from '@/components/SearchBar'

interface Post {
  slug: string
  title: string
  description: string
  date: string
  createdDate?: string
  publishedDate?: string
  tags: string[]
  published: boolean
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchPosts()
    fetchViewCounts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchViewCounts = async () => {
    try {
      const response = await fetch('/api/posts/views')
      const data = await response.json()
      if (data.views) {
        const counts: Record<string, number> = {}
        Object.entries(data.views).forEach(([slug, record]: [string, any]) => {
          counts[slug] = record.viewCount
        })
        setViewCounts(counts)
      }
    } catch (error) {
      console.error('获取浏览计数失败:', error)
    }
  }

  // 搜索过滤
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    const query = searchQuery.toLowerCase().trim()
    return posts.filter(post => {
      if (post.title.toLowerCase().includes(query)) return true
      if (post.description?.toLowerCase().includes(query)) return true
      if (post.tags?.some(tag => tag.toLowerCase().includes(query))) return true
      if (post.slug.toLowerCase().includes(query)) return true
      return false
    })
  }, [posts, searchQuery])

  // 删除文章
  const handleDelete = async (slug: string) => {
    if (!confirm(`确定要删除文章 "${slug}" 吗？此操作不可恢复！`)) return

    setDeletingSlug(slug)
    try {
      const params = new URLSearchParams({ slug })
      const response = await fetch(`/api/posts?${params.toString()}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchPosts()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    } finally {
      setDeletingSlug(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            博客管理后台
          </h1>
          <div className="flex gap-2">
            <Link
              href="/admin/about"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              编辑关于我
            </Link>
            <Link
              href="/admin/comments"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              评论管理
            </Link>
            <Link
              href="/admin/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + 新建文章
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
            <Link
              href="/admin/new"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              创建第一篇文章 →
            </Link>
          </div>
        ) : (
          <>
            {/* 搜索栏 */}
            <div className="mb-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* 搜索结果提示 */}
            {searchQuery && (
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                搜索 "{searchQuery}" — 找到 {filteredPosts.length} 篇
                {filteredPosts.length !== posts.length && `（共 ${posts.length} 篇）`}
              </p>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  未找到匹配 "{searchQuery}" 的文章
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
                >
                  清除搜索
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                      <p>
                        <span className="font-medium">发布日期：</span>
                        {formatDate(post.publishedDate || post.date)}
                      </p>
                      {post.createdDate && (
                        <p>
                          <span className="font-medium">创建日期：</span>
                          {formatDate(post.createdDate)}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">浏览：</span>
                        {viewCounts[post.slug] ?? 0} 次
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {post.published ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Link
                    href={`/admin/edit/${encodeURIComponent(post.slug)}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    编辑
                  </Link>
                  <Link
                    href={`/blog/${encodeURIComponent(post.slug)}`}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingSlug === post.slug ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
