import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const commentsFilePath = path.join(process.cwd(), 'src', 'data', 'comments.json')

// 读取评论数据
function readComments(): any[] {
  if (!fs.existsSync(commentsFilePath)) {
    return []
  }
  const data = fs.readFileSync(commentsFilePath, 'utf8')
  const comments = JSON.parse(data || '[]')
  // 确保旧评论有 likeCount/dislikeCount 字段
  return comments.map((c: any) => ({
    ...c,
    likeCount: typeof c.likeCount === 'number' ? c.likeCount : 0,
    dislikeCount: typeof c.dislikeCount === 'number' ? c.dislikeCount : 0,
  }))
}

// 写入评论数据
function writeComments(comments: any[]) {
  const dir = path.dirname(commentsFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8')
}

// 读取评论者数据
function readCommenters(): any[] {
  const commentersFilePath = path.join(process.cwd(), 'src', 'data', 'commenters.json')
  if (!fs.existsSync(commentersFilePath)) {
    return []
  }
  const data = fs.readFileSync(commentersFilePath, 'utf8')
  return JSON.parse(data || '[]')
}

// 写入评论者数据
function writeCommenters(commenters: any[]) {
  const commentersFilePath = path.join(process.cwd(), 'src', 'data', 'commenters.json')
  const dir = path.dirname(commentersFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(commentersFilePath, JSON.stringify(commenters, null, 2), 'utf8')
}

// GET: 获取指定文章的评论（或全部评论）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const commenterId = searchParams.get('commenterId') // 按评论者 ID 筛选

    const comments = readComments()

    // 如果不传 slug，返回所有评论（用于后台管理）
    if (!slug) {
      // 按评论者 ID 筛选
      if (commenterId) {
        const filtered = comments.filter((c) => c.authorId === commenterId)
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        return NextResponse.json({ comments: filtered })
      }

      // 按时间倒序排列
      comments.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      return NextResponse.json({ comments })
    }

    const articleComments = comments.filter((c) => c.articleSlug === slug)

    // 按时间倒序排列
    articleComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ comments: articleComments })
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// DELETE: 删除评论
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '缺少评论 ID' },
        { status: 400 }
      )
    }

    const comments = readComments().filter((c) => c.id !== id)
    writeComments(comments)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评论失败:', error)
    return NextResponse.json(
      { error: '删除评论失败', details: String(error) },
      { status: 500 }
    )
  }
}

// POST: 提交新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { articleSlug, authorName, authorId, content } = body

    if (!articleSlug || !authorName || !content) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      )
    }

    const comments = readComments()
    const commenters = readCommenters()

    // 昵称唯一性校验：检查是否有其他评论者已使用该昵称
    const trimmedName = authorName.trim()
    const existingCommenter = commenters.find(
      (c) => c.name === trimmedName && c.id !== authorId
    )
    if (existingCommenter) {
      return NextResponse.json(
        { error: '该昵称已被其他人使用，请换一个昵称', code: 'NICKNAME_TAKEN' },
        { status: 409 }
      )
    }

    // 创建新评论
    const newComment: any = {
      id: uuidv4(),
      articleSlug,
      authorName: trimmedName,
      authorId: authorId || uuidv4(), // 如果没有提供 ID，生成一个新的
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      dislikeCount: 0,
    }

    comments.push(newComment)
    writeComments(comments)

    // 更新或创建评论者记录
    let commenter = commenters.find((c) => c.id === newComment.authorId)
    if (!commenter) {
      commenter = {
        id: newComment.authorId,
        name: trimmedName,
        firstCommentAt: newComment.createdAt,
        commentCount: 0,
      }
      commenters.push(commenter)
    }

    // 更新评论者信息
    commenter.name = trimmedName // 更新最新昵称
    commenter.commentCount += 1
    commenter.lastCommentAt = newComment.createdAt

    writeCommenters(commenters)

    return NextResponse.json({
      success: true,
      comment: newComment,
    })
  } catch (error) {
    console.error('提交评论失败:', error)
    return NextResponse.json(
      { error: '提交评论失败', details: String(error) },
      { status: 500 }
    )
  }
}
