import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

// GET: 获取所有文章列表或单篇文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // 如果提供了 slug，返回单篇文章
    if (slug) {
      const filePath = path.join(postsDirectory, `${slug}.mdx`)

      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: '文章不存在' },
          { status: 404 }
        )
      }

      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      return NextResponse.json({
        post: {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          createdDate: data.createdDate || data.date || '',
          publishedDate: data.publishedDate || data.date || '',
          tags: data.tags || [],
          published: data.published ?? false,
          content: content || '',
        }
      })
    }

    // 否则返回所有文章列表
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [] })
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          createdDate: data.createdDate || data.date || '',
          publishedDate: data.publishedDate || data.date || '',
          tags: data.tags || [],
          published: data.published ?? false,
        }
      })
      .sort((a, b) => new Date(b.publishedDate || b.date).getTime() - new Date(a.publishedDate || a.date).getTime())

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// POST: 保存或更新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, frontmatter, content, isNew } = body

    if (!slug || !frontmatter || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // 生成文件路径
    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    const fileExists = fs.existsSync(filePath)

    // 处理日期
    const now = new Date().toISOString().split('T')[0]
    const createdDate = isNew || !fileExists ? now : frontmatter.createdDate || now
    const publishedDate = frontmatter.published ? (frontmatter.publishedDate || now) : frontmatter.publishedDate
    // date 始终等于 publishedDate，保证客户端显示一致
    const date = publishedDate || frontmatter.date || now

    // 构建 MDX 内容
    let mdxContent = `---
title: ${frontmatter.title}
description: ${frontmatter.description}
date: ${date}
createdDate: ${createdDate}
publishedDate: ${publishedDate || ''}
tags: [${frontmatter.tags.map((tag: string) => `"${tag}"`).join(', ')}]
published: ${frontmatter.published}
---

${content}`

    // 写入文件
    fs.writeFileSync(filePath, mdxContent, 'utf8')

    return NextResponse.json({
      success: true,
      path: filePath,
    })
  } catch (error) {
    console.error('保存文章失败:', error)
    return NextResponse.json(
      { error: '保存文章失败', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE: 删除文章（即使文件不存在也视为成功）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: '缺少文章 slug' },
        { status: 400 }
      )
    }

    const filePath = path.join(postsDirectory, `${slug}.mdx`)

    // 如果文件不存在，直接返回成功（用于清理无效数据）
    if (!fs.existsSync(filePath)) {
      console.warn(`文章文件不存在，但仍标记为已删除：${slug}`)
      return NextResponse.json({
        success: true,
        message: '文章已删除',
      })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({
      success: true,
      message: '文章已删除',
    })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { error: '删除文章失败', details: String(error) },
      { status: 500 }
    )
  }
}
