'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  post: {
    slug: string
    title: string
    description: string
    date: string
    publishedDate?: string
    tags?: string[]
    readingTime?: number
  }
}

export function BlogCard({ post }: BlogCardProps) {
  const displayDate = post.publishedDate || post.date
  return (
    <article className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* 标题 */}
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
        <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* 描述 */}
      <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
        {post.description}
      </p>

      {/* 元信息 */}
      <div className="mt-auto flex flex-col gap-3">
        {/* 日期和阅读时间 */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={displayDate}>
            {formatDate(displayDate)}
          </time>
          {post.readingTime && (
            <>
              <span className="mx-2">•</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
