import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Comments from '@/components/Comments'
import PostVote from '@/components/PostVote'
import ViewTracker from '@/components/ViewTracker'
import ViewCount from '@/components/ViewCount'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return { title: '文章未找到' }
  }

  const title = post.data.title
  const description = post.data.description || ''
  const publishedTime = post.data.publishedDate || post.data.date

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime: publishedTime,
      tags: post.data.tags,
      url: `${siteUrl}/blog/${encodeURIComponent(params.slug)}`,
      siteName: '我的个人博客',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// 生成静态参数（SSG）
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post || !post.data.published) {
    notFound()
  }

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description || '',
    datePublished: post.data.publishedDate || post.data.date,
    dateCreated: post.data.createdDate || post.data.date,
    dateModified: post.data.publishedDate || post.data.date,
    author: { '@type': 'Person', name: 'Author Name' },
    url: `${siteUrl}/blog/${encodeURIComponent(params.slug)}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${encodeURIComponent(params.slug)}`,
    },
  }

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 浏览追踪（不可见） */}
      <ViewTracker slug={params.slug} />

      <div className="mx-auto px-4 py-16 max-w-4xl">
        {/* 返回按钮 */}
        <Link
          href="/blog"
          className="text-primary-600 hover:text-primary-700 mb-8 inline-block"
        >
          ← 返回博客列表
        </Link>

        {/* 文章头部 — 全宽，标题最醒目 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.data.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.data.publishedDate || post.data.date}>
              发布于 {formatDate(post.data.publishedDate || post.data.date)}
            </time>

            <ViewCount slug={params.slug} />

            {post.data.tags && post.data.tags.length > 0 && (
              <div className="flex gap-2">
                {post.data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 文章正文 */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 文章点赞点踩 + 评论区 */}
        <section className="mt-24">
          <PostVote slug={params.slug} />
          <Comments articleSlug={params.slug} />
        </section>

        {/* 文章底部导航 */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <nav className="flex justify-between">
            <Link
              href="/blog"
              className="text-primary-600 hover:text-primary-700"
            >
              ← 所有文章
            </Link>
          </nav>
        </footer>
      </div>
    </article>
  )
}
