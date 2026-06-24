// 博客文章类型定义
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  published: boolean
  createdDate?: string  // 创建日期
  publishedDate?: string  // 发布日期
}

// Frontmatter 类型（MDX 文件头部元数据）
export interface Frontmatter {
  title: string
  description: string
  date: string
  tags?: string[]
  published?: boolean
  createdDate?: string  // 创建日期
  publishedDate?: string  // 发布日期
}

// SEO 元数据类型
export interface SeoMeta {
  title: string
  description: string
  keywords?: string[]
  image?: string
}
