import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { BlogCard } from '@/components/BlogCard'

export default function Home() {
  const latestPosts = getAllPosts()
    .filter((post) => post.published)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            分享技术、生活和个人思考
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              浏览文章
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              关于我
            </Link>
          </div>
        </section>

        {/* Featured Posts Preview */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              最新文章
            </h2>
            {latestPosts.length > 0 && (
              <Link
                href="/blog"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                查看全部 →
              </Link>
            )}
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              暂无文章，敬请期待...
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
