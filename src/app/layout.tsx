import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '我的个人博客',
    template: '%s | 我的个人博客',
  },
  description: '分享技术、生活和个人思考的个人博客',
  keywords: ['blog', 'technology', 'personal', '技术博客'],
  authors: [{ name: 'Author Name' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '我的个人博客',
    title: '我的个人博客',
    description: '分享技术、生活和个人思考的个人博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '我的个人博客',
    description: '分享技术、生活和个人思考的个人博客',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="我的个人博客 RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
