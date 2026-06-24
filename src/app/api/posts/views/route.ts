import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const viewsFilePath = path.join(process.cwd(), 'src', 'data', 'post_views.json')

interface ViewRecord {
  slug: string
  viewCount: number
  lastViewedAt: string
}

// 读取浏览记录
function readViews(): Record<string, ViewRecord> {
  if (!fs.existsSync(viewsFilePath)) {
    return {}
  }
  const data = fs.readFileSync(viewsFilePath, 'utf8')
  return JSON.parse(data || '{}')
}

// 写入浏览记录
function writeViews(views: Record<string, ViewRecord>) {
  const dir = path.dirname(viewsFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(viewsFilePath, JSON.stringify(views, null, 2), 'utf8')
}

// GET: 获取浏览计数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    const views = readViews()

    if (slug) {
      // 返回单篇文章的浏览计数
      const record = views[slug]
      return NextResponse.json({
        slug,
        viewCount: record?.viewCount || 0,
        lastViewedAt: record?.lastViewedAt || null,
      })
    }

    // 返回所有文章的浏览计数
    const allViews = Object.values(views).reduce(
      (acc, record) => {
        acc[record.slug] = {
          viewCount: record.viewCount,
          lastViewedAt: record.lastViewedAt,
        }
        return acc
      },
      {} as Record<string, { viewCount: number; lastViewedAt: string }>
    )

    return NextResponse.json({ views: allViews })
  } catch (error) {
    console.error('获取浏览计数失败:', error)
    return NextResponse.json(
      { error: '获取浏览计数失败' },
      { status: 500 }
    )
  }
}

// POST: 增加浏览计数
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return NextResponse.json(
        { error: '缺少文章 slug' },
        { status: 400 }
      )
    }

    const views = readViews()
    const now = new Date().toISOString()

    if (views[slug]) {
      views[slug].viewCount += 1
      views[slug].lastViewedAt = now
    } else {
      views[slug] = {
        slug,
        viewCount: 1,
        lastViewedAt: now,
      }
    }

    writeViews(views)

    return NextResponse.json({
      success: true,
      slug,
      viewCount: views[slug].viewCount,
    })
  } catch (error) {
    console.error('增加浏览计数失败:', error)
    return NextResponse.json(
      { error: '增加浏览计数失败', details: String(error) },
      { status: 500 }
    )
  }
}
