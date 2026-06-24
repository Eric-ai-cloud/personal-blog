import { getPostBySlug, getAllPosts } from '@/lib/posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

/**
 * RSS 2.0 Feed 生成
 * 为 RSS 阅读器提供文章订阅
 */
export async function GET() {
  const posts = getAllPosts()
    .filter((post) => post.published)
    .sort(
      (a, b) =>
        new Date(b.publishedDate || b.date).getTime() -
        new Date(a.publishedDate || a.date).getTime()
    )

  const items = posts
    .map((post) => {
      const fullPost = getPostBySlug(post.slug)
      const content = fullPost?.content || ''
      // 对 HTML 内容做基本的 XML 转义
      const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

      const postUrl = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`

      const categories =
        post.tags && post.tags.length > 0
          ? post.tags
              .map((tag) => `      <category>${tag}</category>`)
              .join('\n')
          : ''

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description || ''}]]></description>
      <content:encoded><![CDATA[${escapedContent}]]></content:encoded>
      <pubDate>${new Date(post.publishedDate || post.date).toUTCString()}</pubDate>${
        categories ? '\n' + categories : ''
      }
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>我的个人博客</title>
    <link>${siteUrl}</link>
    <description>分享技术、生活和个人思考的个人博客</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
