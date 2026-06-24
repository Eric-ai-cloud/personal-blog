# ⚡ 个人博客项目 - 快速参考卡片

> **提示**: 将此文件加入书签或置顶，方便日常开发查阅

---

## 🚀 常用命令速查

```bash
# 开发
npm run dev              # 启动开发服务器 (http://localhost:3000)

# 检查
npm run lint             # ESLint 代码检查
npm run format           # Prettier 代码格式化

# 构建
npm run build            # 生产环境构建
npm run start            # 运行生产版本
```

---

## 📁 目录结构速查

```
src/
├── app/                 # 页面路由 ⭐
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 首页
│   └── blog/           # 博客模块
│       ├── page.tsx    # 列表页
│       └── [slug]/     # 动态路由
│           └── page.tsx # 详情页
│
├── components/         # React 组件 (待创建)
├── lib/                # 工具函数 ⭐
│   └── posts.ts       # 文章处理
├── styles/             # 全局样式 ⭐
│   └── globals.css
├── types/              # 类型定义 ⭐
│   └── index.ts
└── content/            # MDX 文章 ⭐
    └── posts/
```

---

## 📝 Git Commit 规范速查

```bash
# 格式
git commit -m "<type>: <description>"

# Type 类型
feat:     新功能          例: feat: add blog search
fix:      Bug修复        例: fix: resolve layout issue
docs:     文档更新        例: docs: update README
style:    代码格式        例: style: format code
refactor: 重构           例: refactor: extract component
test:     测试相关        例: test: add unit test
chore:    构建/工具       例: chore: update dependencies
```

---

## 🏷️ 命名规范速查

| 类型 | 规则 | 示例 |
|------|------|------|
| **组件文件** | PascalCase | `BlogCard.tsx` |
| **工具文件** | camelCase | `formatDate.ts` |
| **变量** | camelCase | `const blogTitle` |
| **常量** | UPPER_SNAKE_CASE | `MAX_POSTS` |
| **函数** | camelCase | `formatDate()` |
| **布尔值** | is/has/should | `isVisible` |
| **事件处理** | handleXxx | `handleClick` |
| **类型/接口** | PascalCase | `BlogPost` |

---

## 💻 TypeScript 核心类型

```typescript
// 博客文章
interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  published: boolean
}

// Frontmatter (MDX头部)
interface Frontmatter {
  title: string
  description: string
  date: string
  tags?: string | string[]
  published?: boolean
}
```

---

## 🎨 Tailwind 常用类速查

### 布局
```tsx
className="flex items-center justify-between"  // Flexbox
className="grid grid-cols-3 gap-4"             // Grid
className="container mx-auto px-4"             // 容器
```

### 间距
```tsx
className="p-4 m-4"        // padding, margin
className="px-4 py-2"      // 水平/垂直内边距
className="gap-4 space-y-2" // 间距
```

### 文字
```tsx
className="text-lg font-bold text-gray-900"    // 文字样式
className="text-center line-through"           // 文本装饰
```

### 响应式
```tsx
className="text-sm md:text-base lg:text-lg"    // 响应式字号
className="block md:hidden lg:block"           // 响应式显示
```

### 暗色模式
```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

---

## 🔧 配置文件速查

| 文件 | 用途 | 关键配置 |
|------|------|----------|
| `package.json` | 依赖和脚本 | scripts, dependencies |
| `tsconfig.json` | TypeScript | strict: true, paths: @/* |
| `tailwind.config.ts` | Tailwind | theme, plugins |
| `next.config.js` | Next.js | reactStrictMode, pageExtensions |
| `.eslintrc.json` | ESLint | extends: next/core-web-vitals |
| `.prettierrc` | Prettier | semi: false, singleQuote: true |

---

## 📖 文档导航

| 文档 | 用途 | 阅读时间 |
|------|------|---------|
| [OVERVIEW.md](./OVERVIEW.md) | 项目规范概览 | 5分钟 |
| [QUICKSTART.md](./QUICKSTART.md) | 5分钟上手 | 3分钟 |
| [README.md](./README.md) | 项目介绍 | 5分钟 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 详细规范 | 15分钟 |
| [STANDARDS.md](./STANDARDS.md) | 规范总结 | 10分钟 |
| [STRUCTURE.md](./STRUCTURE.md) | 项目结构 | 10分钟 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献指南 | 5分钟 |
| [DIAGRAM.md](./DIAGRAM.md) | 规范体系图 | 10分钟 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 完成报告 | 10分钟 |

---

## 🆘 常见问题速查

### Q: 端口 3000 被占用？
```bash
PORT=3001 npm run dev
```

### Q: 文章不显示？
1. 检查文件在 `src/content/posts/` 
2. 确认扩展名为 `.mdx`
3. 检查 `published: true`
4. 重启开发服务器

### Q: 样式不生效？
1. 清除浏览器缓存
2. 检查类名拼写
3. 确认 Tailwind 配置

### Q: TypeScript 报错？
1. 运行 `tsc --noEmit` 查看详细错误
2. 检查类型定义是否完整
3. 重启 VS Code

---

## 🔗 路径别名

```typescript
// ✅ 使用路径别名
import { BlogPost } from '@/types'
import { formatDate } from '@/lib/posts'
import Header from '@/components/Header'

// ❌ 避免相对路径
import { BlogPost } from '../../types'
```

---

## 📦 添加新文章步骤

```bash
# 1. 创建文件
# 在 src/content/posts/ 下创建 .mdx 文件

# 2. 添加 Frontmatter
---
title: '文章标题'
description: '文章描述'
date: '2024-01-15'
tags: ['tag1', 'tag2']
published: true
---

# 3. 编写内容
# 这里是文章内容...

# 4. 保存并预览
# http://localhost:3000/blog/your-post-slug
```

---

## 🎯 开发检查清单

提交代码前：

```
□ npm run lint 通过
□ npm run format 格式化
□ TypeScript 无错误
□ 功能测试通过
□ 响应式设计检查
□ 文档已更新
□ Commit 信息规范
```

---

## 📞 获取帮助

- 📖 [完整文档](./OVERVIEW.md)
- 🚀 [快速开始](./QUICKSTART.md)
- 📝 [开发规范](./DEVELOPMENT.md)
- ❓ [创建 Issue](https://github.com/your-repo/issues)

---

## 🔗 外部资源

- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 官方文档](https://react.dev/)

---

**提示**: 建议将此文件打印或保存为 PDF，放在工作台随时查阅！

**版本**: v1.0.0  
**最后更新**: 2024-01-01
