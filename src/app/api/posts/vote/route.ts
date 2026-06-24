import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const postVotesFilePath = path.join(process.cwd(), 'src', 'data', 'post_votes.json')

// 读取文章投票数据
function readPostVotes(): any {
  if (!fs.existsSync(postVotesFilePath)) {
    return {}
  }
  const data = fs.readFileSync(postVotesFilePath, 'utf8')
  return JSON.parse(data || '{}')
}

// 写入文章投票数据
function writePostVotes(votes: any) {
  const dir = path.dirname(postVotesFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(postVotesFilePath, JSON.stringify(votes, null, 2), 'utf8')
}

// GET: 获取文章的点赞点踩数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: '缺少文章 slug' },
        { status: 400 }
      )
    }

    const votes = readPostVotes()
    const postVote = votes[slug] || { likeCount: 0, dislikeCount: 0, voters: {} }

    return NextResponse.json({
      slug,
      likeCount: postVote.likeCount || 0,
      dislikeCount: postVote.dislikeCount || 0,
      voters: postVote.voters || {},
    })
  } catch (error) {
    console.error('获取文章投票数据失败:', error)
    return NextResponse.json(
      { error: '获取文章投票数据失败' },
      { status: 500 }
    )
  }
}

// POST: 点赞 / 点踩文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, action, commenterId } = body // action: "like" | "dislike"

    if (!slug || !action || !commenterId) {
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

    const votes = readPostVotes()

    // 初始化文章投票数据
    if (!votes[slug]) {
      votes[slug] = {
        likeCount: 0,
        dislikeCount: 0,
        voters: {},
      }
    }

    const postVote = votes[slug]
    const existingVote = postVote.voters[commenterId]

    if (existingVote === action) {
      // 已投过相同的票 → 取消投票（撤销）
      if (action === 'like') {
        postVote.likeCount = Math.max(0, postVote.likeCount - 1)
      } else {
        postVote.dislikeCount = Math.max(0, postVote.dislikeCount - 1)
      }
      delete postVote.voters[commenterId]
    } else if (existingVote) {
      // 已投不同类型的票 → 切换投票
      if (existingVote === 'like') {
        postVote.likeCount = Math.max(0, postVote.likeCount - 1)
      } else {
        postVote.dislikeCount = Math.max(0, postVote.dislikeCount - 1)
      }

      if (action === 'like') {
        postVote.likeCount += 1
      } else {
        postVote.dislikeCount += 1
      }
      postVote.voters[commenterId] = action
    } else {
      // 没有投过票 → 新增投票
      if (action === 'like') {
        postVote.likeCount += 1
      } else {
        postVote.dislikeCount += 1
      }
      postVote.voters[commenterId] = action
    }

    writePostVotes(votes)

    return NextResponse.json({
      success: true,
      likeCount: postVote.likeCount,
      dislikeCount: postVote.dislikeCount,
      votedAction: postVote.voters[commenterId] || null,
    })
  } catch (error) {
    console.error('文章投票失败:', error)
    return NextResponse.json(
      { error: '文章投票失败', details: String(error) },
      { status: 500 }
    )
  }
}
