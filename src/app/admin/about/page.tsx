'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RichEditor from '@/components/admin/RichEditor'
import { isStaticMode } from '@/lib/static-mode'
import StaticFallback from '@/components/admin/StaticFallback'

export default function EditAboutPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')

  // 加载现有内容
  useEffect(() => {
    if (isStaticMode()) return
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      if (data.about?.content) {
        setContent(data.about.content)
      }
    } catch (error) {
      console.error('加载内容失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (data.success) {
        alert('保存成功！')
      } else {
        alert('保存失败: ' + data.error)
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (isStaticMode()) {
    return <StaticFallback adminPath="/admin/about" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            编辑关于我
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
        <div className="space-y-6">
          {/* 提示 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            💡 这里是博客首页「关于我」链接对应的页面内容，支持富文本编辑。
          </div>

          {/* Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              页面内容
            </h2>
            <RichEditor content={content} onChange={setContent} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              取消
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
