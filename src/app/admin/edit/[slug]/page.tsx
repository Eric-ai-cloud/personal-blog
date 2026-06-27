'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import RichEditor from '@/components/admin/RichEditor'
import FrontmatterForm, { type FrontmatterFormRef } from '@/components/admin/FrontmatterForm'

export const dynamic = 'force-dynamic'
export const runtime = 'edge' // 可选，使用边缘 runtime 更适配静态部署
这个配置告诉Next.js，这个页面不需要在构建时预渲染，完全由客户端在运行时处理，可以绕过generateStaticParams的要求，你的编辑后台功能完全不受影响。
export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const formRef = useRef<FrontmatterFormRef>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [formData, setFormData] = useState<{
    title: string
    description: string
    date: string
    createdDate: string
    publishedDate: string
    tags: string[]
    published: boolean
  } | null>(null)

  // 加载文章数据
  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (postSlug: string) => {
    try {
      // Next.js 路由参数可能已编码，需要解码
      const decodedSlug = decodeURIComponent(postSlug)
      const params = new URLSearchParams({ slug: decodedSlug })
      const response = await fetch(`/api/posts?${params.toString()}`)
      const data = await response.json()

      if (data.post) {
        setSlug(decodedSlug)
        setContent(data.post.content || '')
        setFormData({
          title: data.post.title || '',
          description: data.post.description || '',
          date: data.post.date || '',
          createdDate: data.post.createdDate || '',
          publishedDate: data.post.publishedDate || '',
          tags: data.post.tags || [],
          published: data.post.published ?? true,
        })
      } else {
        alert('文章不存在')
        router.push('/admin')
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      alert('加载文章失败')
    } finally {
      setLoading(false)
    }
  }

  // 生成 slug（保留中文字符）
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSave = async () => {
    const currentValues = formRef.current?.getValues()

    if (!currentValues?.title || currentValues.title.trim() === '') {
      alert('请填写标题')
      return
    }

    setSaving(true)
    try {
      const newSlug = generateSlug(currentValues.title)
      const finalSlug = slug || newSlug

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: finalSlug,
          frontmatter: {
            ...currentValues,
            date: currentValues.date,
          },
          content,
          isNew: false,
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
            编辑文章
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
            {formData && (
              <FrontmatterForm
                ref={formRef}
                defaultValues={formData}
              />
            )}
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
