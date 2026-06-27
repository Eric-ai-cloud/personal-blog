'use client'

import { useEffect, useState } from 'react'

interface ViewCountProps {
  slug: string
}

/**
 * 浏览计数显示组件
 * 从服务端获取并显示文章的浏览次数
 */
export default function ViewCount({ slug }: ViewCountProps) {
  const [viewCount, setViewCount] = useState<number | null>(null)

  useEffect(() => {
    // 静态模式下不显示浏览计数
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      setViewCount(0)
      return
    }
    fetch(`/api/posts/views?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        setViewCount(data.viewCount || 0)
      })
      .catch(() => {
        setViewCount(0)
      })
  }, [slug])

  if (viewCount === null) return null

  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {viewCount} 次浏览
    </span>
  )
}
