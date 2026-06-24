# 项目规范总结 (Project Standards Summary)

## 📋 已建立的开发规范

本文档总结了个人博客项目的核心开发规范和约定。

---

## 1️⃣ 技术栈规范

### 核心技术
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS
- **内容格式**: MDX (Markdown + JSX)
- **部署平台**: Vercel

### 关键依赖
```json
{
  "next": "^14.1.0",
  "react": "^18.2.0",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.1",
  "@mdx-js/loader": "^3.0.0",
  "next-mdx-remote": "^4.4.1"
}
```

**理由**: 
- 现代化、高性能的技术栈
- 优秀的开发者体验
- 良好的类型安全
- SEO 友好

---

## 2️⃣ 代码规范

### TypeScript 规范
✅ **必须遵守:**
- 启用 `strict` 模式
- 所有组件和函数必须有明确的类型
- 避免使用 `any`，优先使用 `unknown`
- 充分利用类型推断
- 接口使用 PascalCase 命名

```typescript
// ✅ 正确示例
interface BlogPost {
  slug: string
  title: string
  published: boolean
}

// ❌ 错误示例
const data: any = {}
```

### React 规范
✅ **必须遵守:**
- 使用函数式组件和 Hooks
- 组件文件使用 PascalCase 命名
- Props 必须有明确的类型定义
- 单个文件只包含一个主要组件
- 使用 `use client` 标记客户端组件

```typescript
// ✅ 正确示例
'use client'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return <header>{title}</header>
}
```

### 文件组织规范
✅ **目录结构:**
```
src/
├── app/              # Next.js App Router 页面
├── components/       # 可复用组件
├── lib/             # 工具函数
├── styles/          # 全局样式
├── types/           # TypeScript 类型定义
└── content/         # MDX 博客文章
```

---

## 3️⃣ 命名规范

### 文件和目录
| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 组件 | PascalCase | `BlogCard.tsx`, `Header.tsx` |
| 工具函数 | camelCase | `formatDate.ts`, `utils.ts` |
| 类型定义 | PascalCase | `index.ts` (types目录下) |
| 页面路由 | 小写/连字符 | `blog-post/page.tsx` |
| 常量 | UPPER_SNAKE_CASE | `MAX_POSTS_PER_PAGE` |

### 变量和函数
```typescript
// 变量 - camelCase
const blogTitle = 'My Blog'
const publishedPosts = []

// 函数 - camelCase
function formatDate(date: Date): string
function getPostBySlug(slug: string): Post

// 布尔值 - is/has/should 前缀
const isVisible = true
const hasPermission = false

// 接口/类型 - PascalCase
interface BlogPost { }
type UserRole = 'admin' | 'user'
```

---

## 4️⃣ Git 工作流规范

### 分支策略
```
main                    # 主分支（生产环境）
├── develop            # 开发分支
│   ├── feature/xxx    # 功能分支
│   ├── fix/xxx        # 修复分支
│   └── refactor/xxx   # 重构分支
```

### Commit 规范 (Conventional Commits)

**格式:**
```
<type>[scope]: <description>

[optional body]

[optional footer]
```

**Type 类型:**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例:**
```bash
git commit -m "feat: add blog search functionality"
git commit -m "fix: resolve header responsive issue"
git commit -m "docs: update README installation guide"
```

---

## 5️⃣ 样式规范

### Tailwind CSS 使用
✅ **推荐:**
- 直接使用实用类
- 保持类的顺序一致性
- 使用响应式前缀 (`sm:`, `md:`, `lg:`)

```tsx
<div className="flex items-center justify-between gap-4 md:gap-6">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

### 暗色模式支持
```tsx
// 使用 dark: 前缀
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

---

## 6️⃣ 性能优化规范

### 图片优化
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // 首屏图片
/>
```

### 字体优化
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

### 动态导入
```tsx
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

---

## 7️⃣ 安全规范

### 环境变量
```bash
# .env.local
DATABASE_URL=xxx              # 仅服务端
NEXT_PUBLIC_API_URL=xxx       # 客户端可访问
```

```typescript
// 代码中正确使用
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### XSS 防护
- Next.js 默认转义输出
- 避免不必要的 `dangerouslySetInnerHTML`
- 必要时使用 DOMPurify 清理 HTML

---

## 8️⃣ 文档规范

### 必备文档
- ✅ `README.md` - 项目介绍和快速开始
- ✅ `DEVELOPMENT.md` - 详细开发规范
- ✅ `CONTRIBUTING.md` - 贡献指南
- ✅ `QUICKSTART.md` - 5分钟快速上手

### 代码注释
```typescript
/**
 * 获取所有已发布的博客文章
 * @returns 博客文章数组，按日期倒序
 */
export function getAllPublishedPosts(): BlogPost[] {
  // ...
}
```

---

## 9️⃣ 测试规范（后续补充）

计划添加：
- 单元测试 (Jest)
- 组件测试 (React Testing Library)
- E2E 测试 (Playwright)

---

## 🔟 持续集成规范（后续补充）

计划添加：
- GitHub Actions 工作流
- 自动化测试
- 自动化部署

---

## 📊 规范检查清单

### 提交代码前自查

**代码质量**
- [ ] TypeScript 无错误
- [ ] ESLint 检查通过
- [ ] Prettier 格式化通过
- [ ] 无 console.log 遗留

**代码风格**
- [ ] 命名符合规范
- [ ] 类型定义完整
- [ ] 组件结构清晰
- [ ] 适当的注释

**功能验证**
- [ ] 功能正常工作
- [ ] 响应式设计正常
- [ ] 暗色模式正常
- [ ] 无明显性能问题

**文档**
- [ ] 更新了相关文档
- [ ] Commit 信息规范
- [ ] 添加了必要的注释

---

## 🔄 规范更新流程

1. 提出规范修改建议
2. 团队讨论（如适用）
3. 更新本文档
4. 通知团队成员
5. 执行新规范

---

## 📞 联系与反馈

如有规范相关问题或改进建议：
- 查看完整文档
- 创建 Issue 讨论
- Pull Request 改进

---

**版本**: v1.0.0  
**最后更新**: 2024-01-01  
**维护者**: Personal Blog Team
