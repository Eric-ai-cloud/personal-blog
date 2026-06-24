# 📊 个人博客项目规范体系图

> 本文档以可视化方式展示项目的规范体系和开发流程

---

## 🏗️ 规范体系架构

```
┌─────────────────────────────────────────────────────────┐
│                  个人博客项目规范体系                      │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │技术栈规范│      │代码规范  │     │工作流规范│
   └────┬────┘      └────┬────┘     └────┬────┘
        │                │                │
        │         ┌──────┴──────┐        │
        │         │             │        │
        │    ┌────▼────┐  ┌────▼────┐   │
        │    │TypeScript│  │ React   │   │
        │    │  规范    │  │ 规范    │   │
        │    └─────────┘  └─────────┘   │
        │                                │
        └────────────────┬───────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
         ┌────▼────┐          ┌────▼────┐
         │命名规范  │          │文件组织  │
         └─────────┘          └─────────┘
```

---

## 📋 规范分类详解

### 1️⃣ 技术栈规范

```
技术栈选择
│
├── 前端框架: Next.js 14 (App Router)
│   ├── 优势: SSR/SSG, 路由系统, SEO友好
│   └── 配置: next.config.js
│
├── 编程语言: TypeScript 5+
│   ├── 模式: strict
│   ├── 目标: ES2020
│   └── 配置: tsconfig.json
│
├── 样式方案: Tailwind CSS
│   ├── 方式: Utility-first
│   ├── 主题: 自定义 primary 颜色
│   └── 配置: tailwind.config.ts
│
├── 内容格式: MDX
│   ├── 版本: MDX v3
│   ├── 功能: Markdown + JSX
│   └── 用途: 博客文章
│
└── 部署平台: Vercel
    ├── 优势: 零配置, 自动化部署
    └── 功能: Preview, Analytics
```

---

### 2️⃣ 代码规范

#### TypeScript 规范

```typescript
类型定义规范
│
├── ✅ 启用严格模式
│   └── "strict": true in tsconfig.json
│
├── ✅ 明确的类型注解
│   ├── interface BlogPost { ... }
│   ├── type UserRole = 'admin' | 'user'
│   └── function formatDate(date: Date): string
│
├── ❌ 避免使用 any
│   └── 优先使用 unknown + 类型守卫
│
├── ✅ 利用类型推断
│   └── const posts = [] // 自动推断类型
│
└── ✅ 接口使用 PascalCase
    └── interface Frontmatter { ... }
```

#### React 规范

```typescript
React 组件规范
│
├── ✅ 函数式组件
│   └── export function Component() { ... }
│
├── ✅ Hooks 优先
│   ├── useState, useEffect, useContext
│   └── 自定义 Hooks
│
├── ✅ 明确的 Props 类型
│   └── interface Props { title: string }
│       export function Card({ title }: Props) { ... }
│
├── ✅ PascalCase 命名
│   └── BlogCard.tsx, Header.tsx
│
├── ✅ 'use client' 标记
│   └── 客户端组件明确标注
│
└── ✅ 单一职责
    └── 一个组件只做一件事
```

---

### 3️⃣ 命名规范

```
命名约定
│
├── 文件命名
│   ├── 组件: PascalCase
│   │   └── BlogCard.tsx, Header.tsx
│   │
│   ├── 工具: camelCase
│   │   └── formatDate.ts, utils.ts
│   │
│   ├── 类型: PascalCase
│   │   └── index.ts (types目录)
│   │
│   └── 页面: lowercase/hyphen
│       └── blog-post/page.tsx
│
├── 变量命名
│   ├── 常量: UPPER_SNAKE_CASE
│   │   └── MAX_POSTS_PER_PAGE = 10
│   │
│   ├── 变量: camelCase
│   │   └── const blogTitle = 'My Blog'
│   │
│   └── 布尔值: is/has/should 前缀
│       └── isVisible, hasPermission
│
├── 函数命名
│   ├── 普通函数: camelCase
│   │   └── formatDate(), getUserById()
│   │
│   ├── 事件处理: handleXxx
│   │   └── handleClick, handleSubmit
│   │
│   └── 回调函数: onXxx
│       └── onClick, onSubmit
│
└── 类型命名
    ├── 接口: PascalCase
    │   └── interface BlogPost { ... }
    │
    └── 类型别名: PascalCase
        └── type UserRole = 'admin' | 'user'
```

---

### 4️⃣ Git 工作流规范

```
Git 工作流程
│
├── 分支策略
│   ├── main (生产环境)
│   │   └── 稳定版本，可直接部署
│   │
│   ├── develop (开发分支)
│   │   └── 日常开发集成
│   │
│   └── feature branches
│       ├── feature/add-search
│       ├── fix/header-layout
│       └── refactor/use-hooks
│
├── Commit 规范 (Conventional Commits)
│   │
│   ├── 格式
│   │   └── <type>[scope]: <description>
│   │       [optional body]
│   │       [optional footer]
│   │
│   ├── Type 类型
│   │   ├── feat:     新功能
│   │   ├── fix:      Bug修复
│   │   ├── docs:     文档更新
│   │   ├── style:    代码格式
│   │   ├── refactor: 重构
│   │   ├── test:     测试
│   │   └── chore:    构建/工具
│   │
│   └── 示例
│       ├── git commit -m "feat: add blog search"
│       ├── git commit -m "fix: resolve layout bug"
│       └── git commit -m "docs: update README"
│
└── PR 流程
    ├── 1. 创建 feature 分支
    ├── 2. 开发和测试
    ├── 3. 提交代码（遵循规范）
    ├── 4. 创建 Pull Request
    ├── 5. Code Review
    └── 6. 合并到 develop/main
```

---

### 5️⃣ 文件组织规范

```
src/
│
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   │
│   └── blog/              # 博客模块
│       ├── page.tsx       # 列表页
│       └── [slug]/        # 动态路由
│           └── page.tsx   # 详情页
│
├── components/            # 可复用组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   └── Layout.tsx
│
├── lib/                   # 工具函数
│   ├── posts.ts          # 文章处理
│   └── utils.ts          # 通用工具
│
├── styles/                # 全局样式
│   └── globals.css       # Tailwind + 自定义
│
├── types/                 # 类型定义
│   └── index.ts          # 核心类型
│
└── content/               # 内容文件
    └── posts/             # MDX 文章
        └── first-post.mdx
```

**组织原则**:
- ✅ 按功能分组
- ✅ 扁平化结构（最多3-4层）
- ✅ 清晰的命名
- ✅ 一致性

---

### 6️⃣ 样式规范

```
Tailwind CSS 使用规范
│
├── 基础用法
│   ├── 直接使用实用类
│   │   └── className="flex items-center gap-4"
│   │
│   └── 保持类的顺序
│       └── 布局 → 尺寸 → 间距 → 排版 → 颜色
│
├── 响应式设计
│   ├── 移动优先
│   │   └── className="text-sm md:text-base lg:text-lg"
│   │
│   └── 断点配置
│       ├── sm: 640px
│       ├── md: 768px
│       └── lg: 1024px
│
├── 暗色模式
│   ├── 使用 dark: 前缀
│   │   └── className="bg-white dark:bg-gray-900"
│   │
│   └── 统一管理主题色
│       └── 在 tailwind.config.ts 中配置
│
└── 自定义样式
    ├── @layer base - 基础样式重置
    ├── @layer components - 组件类
    └── @layer utilities - 工具类
```

---

## 🔄 开发流程图

### 日常开发流程

```
开始开发
    │
    ▼
git checkout -b feature/xxx
    │
    ▼
编写代码
    │
    ├── npm run dev (启动开发服务器)
    ├── 保存文件 (自动热重载)
    └── 实时预览效果
    │
    ▼
代码检查
    │
    ├── npm run lint (ESLint检查)
    └── npm run format (Prettier格式化)
    │
    ▼
提交代码
    │
    ├── git add .
    ├── git commit -m "feat: xxx" (遵循规范)
    └── git push origin feature/xxx
    │
    ▼
创建 PR
    │
    ├── GitHub 创建 Pull Request
    ├── 填写 PR 描述
    └── 关联相关 Issue
    │
    ▼
Code Review
    │
    ├── 团队成员审查代码
    ├── 修改反馈意见
    └── 确认符合规范
    │
    ▼
合并代码
    │
    ├── 合并到 develop 分支
    ├── 自动化测试运行
    └── 准备部署
    │
    ▼
部署上线
    │
    └── Vercel 自动部署
```

---

## 📝 添加新文章流程

```
创建新文章
    │
    ▼
在 src/content/posts/ 创建 .mdx 文件
    │
    └── 命名: my-new-post.mdx
    │
    ▼
添加 Frontmatter
    │
    ├── title: '文章标题'
    ├── description: '文章描述'
    ├── date: '2024-01-15'
    ├── tags: ['tag1', 'tag2']
    └── published: true
    │
    ▼
编写 Markdown 内容
    │
    ├── # 一级标题
    ├── ## 二级标题
    ├── 正文内容
    ├── 代码块
    └── 图片/链接
    │
    ▼
保存文件
    │
    └── 自动热重载
    │
    ▼
本地预览
    │
    └── http://localhost:3000/blog/my-new-post
    │
    ▼
确认无误
    │
    └── 提交代码
```

---

## 🎯 质量检查清单

### 代码提交前检查

```
提交前检查
│
├── 代码质量 □
│   ├── TypeScript 无错误
│   ├── ESLint 检查通过
│   └── Prettier 格式化通过
│
├── 代码风格 □
│   ├── 命名符合规范
│   ├── 类型定义完整
│   └── 适当的注释
│
├── 功能验证 □
│   ├── 功能正常工作
│   ├── 边界情况处理
│   └── 无明显性能问题
│
├── 响应式设计 □
│   ├── 移动端显示正常
│   ├── 平板适配良好
│   └── 桌面端适配良好
│
└── 文档更新 □
    ├── 更新了相关文档
    ├── Commit信息规范
    └── 添加了必要注释
```

---

## 📊 规范执行工具

```
自动化工具链
│
├── ESLint
│   ├── 作用: 代码质量检查
│   ├── 配置: .eslintrc.json
│   └── 命令: npm run lint
│
├── Prettier
│   ├── 作用: 代码格式化
│   ├── 配置: .prettierrc
│   └── 命令: npm run format
│
├── TypeScript
│   ├── 作用: 静态类型检查
│   ├── 配置: tsconfig.json
│   └── 命令: tsc --noEmit
│
└── Husky (待添加)
    ├── 作用: Git Hooks
    ├── 功能: 提交前自动检查
    └── 配置: .husky/pre-commit
```

---

## 🔗 文档关系图

```
文档体系
│
├── OVERVIEW.md (总索引)
│   ├── 项目规范概览
│   ├── 快速导航
│   └── 核心要点汇总
│   │
│   ├──► README.md
│   │    ├── 项目介绍
│   │    ├── 技术栈说明
│   │    └── 安装指南
│   │
│   ├──► QUICKSTART.md
│   │    ├── 5分钟上手
│   │    ├── 常用命令
│   │    └── 常见问题
│   │
│   ├──► DEVELOPMENT.md
│   │    ├── 详细开发规范
│   │    ├── 代码示例
│   │    └── 最佳实践
│   │
│   ├──► STANDARDS.md
│   │    ├── 规范总结清单
│   │    ├── 检查清单
│   │    └── 持续改进
│   │
│   ├──► STRUCTURE.md
│   │    ├── 项目结构详解
│   │    ├── 文件说明
│   │    └── 下一步计划
│   │
│   └──► CONTRIBUTING.md
│        ├── 贡献流程
│        ├── PR模板
│        └── 行为准则
```

---

## 🚀 技术栈关系

```
技术栈协同工作
│
├── Next.js 14 (框架层)
│   ├── 提供路由系统 (App Router)
│   ├── 服务端渲染 (SSR)
│   ├── 静态生成 (SSG)
│   └── API 路由
│   │
│   ├──► React 18 (视图层)
│   │    ├── 组件系统
│   │    ├── Hooks
│   │    └── Context API
│   │    │
│   │    └──► TypeScript (类型层)
│   │         ├── 类型安全
│   │         ├── 智能提示
│   │         └── 编译检查
│   │
│   ├──► Tailwind CSS (样式层)
│   │    ├── 实用类
│   │    ├── 响应式
│   │    └── 暗色模式
│   │
│   └──► MDX (内容层)
│        ├── Markdown 语法
│        └── JSX 嵌入
│
└── Vercel (部署层)
     ├── 零配置部署
     ├── 自动化 CI/CD
     └── Edge Function
```

---

## 📈 项目演进路线

```
Phase 1: 基础架构 ✅ (已完成)
│   ├── 项目初始化
│   ├── 配置文件
│   ├── 核心代码
│   └── 文档体系
│
▼
Phase 2: 核心功能 🔄 (进行中)
│   ├── MDX 渲染
│   ├── 语法高亮
│   ├── 导航栏组件
│   └── 暗色模式
│
▼
Phase 3: 增强功能 📋 (计划中)
│   ├── 搜索功能
│   ├── 标签分类
│   ├── RSS Feed
│   └── 评论系统
│
▼
Phase 4: 优化测试 📋 (计划中)
│   ├── 单元测试
│   ├── E2E测试
│   ├── 性能优化
│   └── Lighthouse优化
│
▼
Phase 5: 部署上线 📋 (计划中)
    ├── Vercel部署
    ├── 域名设置
    ├── Analytics集成
    └── 正式发布
```

---

**图表生成时间**: 2024-01-01  
**版本**: v1.0.0  
**状态**: 基础规范体系已建立完成
