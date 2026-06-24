import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'

const aboutFilePath = path.join(process.cwd(), 'src', 'data', 'about.json')

function getAboutContent(): { content: string; updatedAt: string } {
  try {
    if (!fs.existsSync(aboutFilePath)) {
      return { content: '', updatedAt: '' }
    }
    const data = fs.readFileSync(aboutFilePath, 'utf8')
    return JSON.parse(data || '{}')
  } catch {
    return { content: '', updatedAt: '' }
  }
}

export const metadata: Metadata = {
  title: '关于我',
  description: '了解博主的故事和背景',
  openGraph: {
    title: '关于我 | Eric的博客',
    description: '了解博主的故事和背景',
  },
  twitter: {
    card: 'summary_large_image',
    title: '关于我 | Eric的博客',
    description: '了解博主的故事和背景',
  },
}

export default function AboutPage() {
  const about = getAboutContent()

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 mb-8 inline-block"
        >
          ← 返回首页
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            关于我
          </h1>
        </header>

        {/* 内容 */}
        {about.content ? (
          <div
            className="prose-custom text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: about.content }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            暂无内容，敬请期待...
          </p>
        )}
      </div>
    </main>
  )
}
