'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { BlogCard } from '@/components/BlogCard'
import { TagFilter } from '@/components/TagFilter'
import { SortSelector } from '@/components/SortSelector'
import { SearchBar } from '@/components/SearchBar'
import type { BlogPost } from '@/types'

interface BlogClientPageProps {
  allPosts: BlogPost[]
  tags: string[]
}

export default function BlogClientPage({ allPosts, tags }: BlogClientPageProps) {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // 按标题、描述和标签搜索
  const searchedPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts
    const query = searchQuery.toLowerCase().trim()
    return allPosts.filter(post => {
      // 匹配标题
      if (post.title.toLowerCase().includes(query)) return true
      // 匹配描述
      if (post.description?.toLowerCase().includes(query)) return true
      // 匹配标签
      if (post.tags?.some(tag => tag.toLowerCase().includes(query))) return true
      return false
    })
  }, [allPosts, searchQuery])

  // 按标签筛选
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return searchedPosts
    return searchedPosts.filter(post => post.tags?.includes(selectedTag))
  }, [searchedPosts, selectedTag])

  // 排序
  const sortedPosts = useMemo(() => {
    const posts = [...filteredPosts]
    posts.sort((a, b) => {
      const dateA = new Date(a.publishedDate || a.date).getTime()
      const dateB = new Date(b.publishedDate || b.date).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })
    return posts
  }, [filteredPosts, sortBy])

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <header className="mb-8">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Total {sortedPosts.length} article{sortedPosts.length !== 1 ? 's' : ''}
            {searchQuery && ` • 搜索: "${searchQuery}"`}
            {selectedTag && ` • 标签: ${selectedTag}`}
          </p>
        </header>

        {/* 搜索、筛选和排序控制区 */}
        <div className="mb-8 space-y-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TagFilter
              tags={tags}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
            />
            <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        {/* 文章列表 */}
        {sortedPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* 空状态 */
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {searchQuery && selectedTag
                ? `未找到同时匹配 "${searchQuery}" 和标签 "${selectedTag}" 的文章`
                : searchQuery
                  ? `未找到匹配 "${searchQuery}" 的文章`
                  : selectedTag
                    ? `没有标签为 "${selectedTag}" 的文章`
                    : '暂无文章'}
            </p>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
              {searchQuery && '请尝试其他关键词'}
              {searchQuery && selectedTag && ' 或 '}
              {selectedTag && '请尝试选择其他标签'}
            </p>
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag(undefined)
                }}
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
