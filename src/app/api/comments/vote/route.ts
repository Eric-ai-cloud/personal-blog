import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const commentsFilePath = path.join(process.cwd(), 'src', 'data', 'comments.json')
const votesFilePath = path.join(process.cwd(), 'src', 'data', 'votes.json')

// 读取评论数据
function readComments(): any[] {
  if (!fs.existsSync(commentsFilePath)) return []
  const data = fs.readFileSync(commentsFilePath, 'utf8')
  return JSON.parse(data || '[]')
}

// 写入评论数据
function writeComments(comments: any[]) {
  const dir = path.dirname(commentsFilePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8')
}

// 读取投票记录
function readVotes(): any[] {
  if (!fs.existsSync(votesFilePath)) return []
  const data = fs.readFileSync(votesFilePath, 'utf8')
  return JSON.parse(data || '[]')
}

// 写入投票记录
function writeVotes(votes: any[]) {
  const dir = path.dirname(votesFilePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2), 'utf8')
}

// GET: 获取所有投票记录（用于前端初始化用户的投票状态）
export async function GET() {
  try {
    const votes = readVotes()
    return NextResponse.json({ votes })
  } catch (error) {
    console.error('获取投票记录失败:', error)
    return NextResponse.json(
      { error: '获取投票记录失败' },
      { status: 500 }
    )
  }
}

// POST: 点赞 / 点踩
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, action, authorId, authorName } = body // action: "like" | "dislike"

    if (!commentId || !action) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      )
    }

    if (action !== 'like' && action !== 'dislike') {
      return NextResponse.json(
        { error: '无效的投票类型，应为 like 或 dislike' },
        { status: 400 }
      )
    }

    if (!authorId) {
      return NextResponse.json(
        { error: '缺少评论者 ID' },
        { status: 400 }
      )
    }

    const comments = readComments()
    const votes = readVotes()

    // 找到目标评论
    const commentIndex = comments.findIndex((c: any) => c.id === commentId)
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      )
    }

    // 检查是否已投过票：相同用户、同一条评论
    const existingVoteIndex = votes.findIndex(
      (v: any) => v.commentId === commentId && v.authorId === authorId
    )

    if (existingVoteIndex !== -1) {
      // 已投过相同的票 → 取消投票（撤销）
      const existingVote = votes[existingVoteIndex]
      if (existingVote.action === action) {
        // 撤销同类型投票：票数减一，删除投票记录
        if (action === 'like') {
          comments[commentIndex].likeCount = Math.max(0, comments[commentIndex].likeCount - 1)
        } else {
          comments[commentIndex].dislikeCount = Math.max(0, comments[commentIndex].dislikeCount - 1)
        }
        votes.splice(existingVoteIndex, 1)
        writeComments(comments)
        writeVotes(votes)
        return NextResponse.json({
          success: true,
          likeCount: comments[commentIndex].likeCount,
          dislikeCount: comments[commentIndex].dislikeCount,
          votedAction: null, // 撤销后不再标记为已投票
        })
      }

      // 已投不同类型的票 → 切换投票
      // 先撤销旧票
      const oldVote = votes[existingVoteIndex]
      if (oldVote.action === 'like') {
        comments[commentIndex].likeCount = Math.max(0, comments[commentIndex].likeCount - 1)
      } else {
        comments[commentIndex].dislikeCount = Math.max(0, comments[commentIndex].dislikeCount - 1)
      }

      // 添加新票
      if (action === 'like') {
        comments[commentIndex].likeCount += 1
      } else {
        comments[commentIndex].dislikeCount += 1
      }
      votes[existingVoteIndex] = { ...oldVote, action, commentId, authorId, updatedAt: new Date().toISOString() }

      writeComments(comments)
      writeVotes(votes)
      return NextResponse.json({
        success: true,
        likeCount: comments[commentIndex].likeCount,
        dislikeCount: comments[commentIndex].dislikeCount,
        votedAction: action,
      })
    }

    // 没有投过票 → 新增投票
    if (action === 'like') {
      comments[commentIndex].likeCount += 1
    } else {
      comments[commentIndex].dislikeCount += 1
    }

    votes.push({
      id: uuidv4(),
      commentId,
      action,
      authorId,
      authorName: authorName || '',
      createdAt: new Date().toISOString(),
    })

    writeComments(comments)
    writeVotes(votes)

    return NextResponse.json({
      success: true,
      likeCount: comments[commentIndex].likeCount,
      dislikeCount: comments[commentIndex].dislikeCount,
      votedAction: action,
    })
  } catch (error) {
    console.error('投票失败:', error)
    return NextResponse.json(
      { error: '投票失败', details: String(error) },
      { status: 500 }
    )
  }
}
