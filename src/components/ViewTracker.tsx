'use client'

import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
  slug: string
}

/**
 * 浏览追踪组件
 * 在文章页面加载时自动向服务端上报一次浏览
 * 使用 ref 确保不会重复计数（React Strict Mode 下也只计一次）
 */
export default function ViewTracker({ slug }: ViewTrackerProps) {
  const trackedRef = useRef(false)

  useEffect(() => {
    // 防止 Strict Mode 下重复计数
    if (trackedRef.current) return
    trackedRef.current = true

    // 延迟上报，避免与页面渲染抢资源
    const timer = setTimeout(() => {
      fetch('/api/posts/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      }).catch((error) => {
        console.error('浏览计数上报失败:', error)
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  // 不渲染任何 UI
  return null
}
