'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RichEditor from '@/components/admin/RichEditor'
import FrontmatterForm, { type FrontmatterFormRef } from '@/components/admin/FrontmatterForm'

export default function NewPostPage() {
  const router = useRouter()
  const formRef = useRef<FrontmatterFormRef>(null)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState('')
  const [createdDate] = useState(new Date().toISOString().split('T')[0])

  // 生成 slug（保留中文字符）
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSave = async () => {
    // 从表单组件获取最新值
    const currentValues = formRef.current?.getValues()

    if (!currentValues?.title || currentValues.title.trim() === '') {
      alert('请填写标题')
      return
    }

    setSaving(true)
    try {
      const slug = generateSlug(currentValues.title)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          frontmatter: {
            ...currentValues,
            createdDate,
            // 如果用户没填发布日期且勾选了发布，默认用今天
            publishedDate: currentValues.published && !currentValues.publishedDate ? new Date().toISOString().split('T')[0] : (currentValues.publishedDate || ''),
          },
          content,
          isNew: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('保存成功！')
        router.push('/admin')
      } else {
        alert('保存失败：' + data.error)
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            新建文章
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
          {/* Frontmatter Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              文章信息
            </h2>
            <FrontmatterForm
              ref={formRef}
              defaultValues={{
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                createdDate,
                publishedDate: '',
                tags: [],
                published: true,
              }}
            />
          </div>

          {/* Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              文章内容
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
