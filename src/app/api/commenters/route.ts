import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const commentersFilePath = path.join(process.cwd(), 'src', 'data', 'commenters.json')
const commentsFilePath = path.join(process.cwd(), 'src', 'data', 'comments.json')

// 读取评论者数据
function readCommenters(): any[] {
  if (!fs.existsSync(commentersFilePath)) {
    return []
  }
  const data = fs.readFileSync(commentersFilePath, 'utf8')
  return JSON.parse(data || '[]')
}

// 写入评论者数据
function writeCommenters(commenters: any[]) {
  const dir = path.dirname(commentersFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(commentersFilePath, JSON.stringify(commenters, null, 2), 'utf8')
}

// 读取评论数据
function readComments(): any[] {
  if (!fs.existsSync(commentsFilePath)) {
    return []
  }
  const data = fs.readFileSync(commentsFilePath, 'utf8')
  return JSON.parse(data || '[]')
}

// 写入评论数据
function writeComments(comments: any[]) {
  const dir = path.dirname(commentsFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8')
}

// GET: 获取所有评论者
export async function GET() {
  try {
    const commenters = readCommenters()

    // 按最后评论时间倒序排列
    commenters.sort(
      (a, b) =>
        new Date(b.lastCommentAt).getTime() - new Date(a.lastCommentAt).getTime()
    )

    return NextResponse.json({ commenters })
  } catch (error) {
    console.error('获取评论者失败:', error)
    return NextResponse.json(
      { error: '获取评论者失败' },
      { status: 500 }
    )
  }
}

// DELETE: 删除评论者及其所有评论
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '缺少评论者 ID' },
        { status: 400 }
      )
    }

    // 删除该评论者的所有评论
    const comments = readComments().filter((c) => c.authorId !== id)
    writeComments(comments)

    // 删除评论者记录
    const commenters = readCommenters().filter((c) => c.id !== id)
    writeCommenters(commenters)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评论者失败:', error)
    return NextResponse.json(
      { error: '删除评论者失败', details: String(error) },
      { status: 500 }
    )
  }
}
