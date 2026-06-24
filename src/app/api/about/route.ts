import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const aboutFilePath = path.join(process.cwd(), 'src', 'data', 'about.json')

// 读取关于我数据
function readAbout(): { content: string; updatedAt: string } {
  if (!fs.existsSync(aboutFilePath)) {
    return { content: '', updatedAt: '' }
  }
  const data = fs.readFileSync(aboutFilePath, 'utf8')
  return JSON.parse(data || '{}')
}

// 写入关于我数据
function writeAbout(data: { content: string; updatedAt: string }) {
  const dir = path.dirname(aboutFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(aboutFilePath, JSON.stringify(data, null, 2), 'utf8')
}

// GET: 获取关于我内容
export async function GET() {
  try {
    const about = readAbout()
    return NextResponse.json({ about })
  } catch (error) {
    console.error('获取关于我内容失败:', error)
    return NextResponse.json(
      { error: '获取内容失败' },
      { status: 500 }
    )
  }
}

// POST: 保存/更新关于我内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (content === undefined || content === null) {
      return NextResponse.json(
        { error: '缺少内容参数' },
        { status: 400 }
      )
    }

    const updatedAbout = {
      content,
      updatedAt: new Date().toISOString(),
    }

    writeAbout(updatedAbout)

    return NextResponse.json({
      success: true,
      about: updatedAbout,
    })
  } catch (error) {
    console.error('保存关于我内容失败:', error)
    return NextResponse.json(
      { error: '保存失败', details: String(error) },
      { status: 500 }
    )
  }
}
