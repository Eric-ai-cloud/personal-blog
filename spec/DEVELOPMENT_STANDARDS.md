# 📝 开发规范汇总 (Development Standards)

> **要求**: 所有代码必须遵循这些规范  
> **版本**: v1.0.0

---

## 📋 目录

- [TypeScript 规范](#typescript-规范)
- [React 规范](#react-规范)
- [命名规范](#命名规范)
- [文件组织](#文件组织)
- [Git 工作流](#git-工作流)
- [样式规范](#样式规范)
- [性能优化](#性能优化)
- [安全规范](#安全规范)
- [代码质量指标](#代码质量指标)

---

## 🔷 TypeScript 规范

### 严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**规则**:
- ✅ 启用所有严格选项
- ✅ 避免使用 `any`，优先使用 `unknown`
- ✅ 充分利用类型推断

### 类型定义

```typescript
// ✅ 好的做法：明确的类型
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): User | null {
  // ...
}

// ❌ 不好的做法：使用 any
function getUser(id: any): any {
  // ...
}
```

### 接口 vs 类型别名

```typescript
// ✅ 对象形状用 interface
interface BlogPost {
  slug: string
  title: string
}

// ✅ 联合类型、工具类型用 type
type UserRole = 'admin' | 'editor' | 'reader'
type PartialUser = Partial<User>
```

### 类型守卫

```typescript
// ✅ 使用类型守卫
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  )
}

if (isUser(data)) {
  // TypeScript 知道 data 是 User 类型
  console.log(data.name)
}
```

### 可选链和空值合并

```typescript
// ✅ 使用可选链
const userName = user?.profile?.name ?? 'Anonymous'

// ❌ 避免冗长的检查
const userName = user && user.profile && user.profile.name ? user.profile.name : 'Anonymous'
```

---

## ⚛️ React 规范

### 函数式组件

```typescript
// ✅ 好的做法：函数式组件 + Hooks
interface GreetingProps {
  name: string
}

export function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>
}

// ❌ 避免：类组件
class Greeting extends React.Component<GreetingProps> {
  render() {
    return <h1>Hello, {this.props.name}!</h1>
  }
}
```

### 组件结构

```typescript
'use client'

import { useState, useEffect } from 'react'

// 1. 类型定义
interface ComponentProps {
  title: string
  items: string[]
}

// 2. 组件声明
export function Component({ title, items }: ComponentProps) {
  // 3. Hooks
  const [state, setState] = useState<string>('')
  
  // 4. 事件处理
  const handleClick = () => {
    console.log('clicked')
  }
  
  // 5. 副作用
  useEffect(() => {
    // ...
  }, [])
  
  // 6. 渲染
  return (
    <div onClick={handleClick}>
      <h1>{title}</h1>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Props 解构

```typescript
// ✅ 好的做法：在参数列表中解构
function Card({ title, description }: CardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}

// ❌ 避免：不使用时才不解构
function Card(props: CardProps) {
  return (
    <article>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </article>
  )
}
```

### 自定义 Hooks

```typescript
// ✅ 提取可复用逻辑
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    }
    return initialValue
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}

// 使用
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

---

## 🏷️ 命名规范

### 文件和目录

```
src/
├── components/
│   ├── BlogCard.tsx         # PascalCase
│   ├── Header.tsx
│   └── search-box.tsx       # ❌ 错误
├── lib/
│   ├── formatDate.ts        # camelCase
│   └── utils.ts
└── types/
    └── index.ts
```

### 变量和常量

```typescript
// ✅ 变量 - camelCase
const blogTitle = 'My Blog'
const publishedPosts = []

// ✅ 常量 - UPPER_SNAKE_CASE
const MAX_POSTS_PER_PAGE = 10
const API_BASE_URL = 'https://api.example.com'

// ✅ 布尔值 - is/has/should 前缀
const isVisible = true
const hasPermission = false
const shouldUpdate = true
```

### 函数

```typescript
// ✅ 普通函数 - camelCase
function formatDate(date: Date): string { }
function getUserById(id: string): User { }

// ✅ 事件处理 - handleXxx
function handleClick() { }
function handleSubmit() { }

// ✅ 回调函数 - onXxx
function onClick() { }
function onSubmit() { }

// ✅ 私有函数 - _prefix（如需要）
function _internalHelper() { }
```

### 类和接口

```typescript
// ✅ PascalCase
class UserService { }
interface BlogPost { }
type UserRole = 'admin' | 'user'

// ✅ 接口不加 I 前缀
interface User { }           // ✅
interface IUser { }          // ❌
```

---

## 📁 文件组织

### 导入顺序

```typescript
// 1. Node.js 内置模块
import path from 'path'
import fs from 'fs'

// 2. 第三方库
import React from 'react'
import { useRouter } from 'next/router'

// 3. 项目内部模块（按层级）
import { BlogPost } from '@/types'
import { formatDate } from '@/lib/posts'
import Header from '@/components/Header'

// 4. 相对路径导入
import { helper } from './utils'
```

### 导出方式

```typescript
// ✅ 推荐：命名导出
export function formatDate() { }
export interface User { }

// ⚠️ 谨慎使用：默认导出（每个文件最多一个）
export default function Component() { }

// ❌ 避免：混合导出
export default Component
export { helper1, helper2 }
```

### 路径别名

```typescript
// ✅ 使用路径别名
import { User } from '@/types'
import { formatDate } from '@/lib/posts'

// ❌ 避免：深层相对路径
import { User } from '../../types'
import { formatDate } from '../../../lib/posts'
```

---

## 🌳 Git 工作流

### 分支策略

```
main                # 生产环境，稳定版本
├── develop         # 开发分支
│   ├── feature/add-search    # 功能分支
│   ├── fix/header-layout     # 修复分支
│   └── refactor/hooks        # 重构分支
```

### Commit 规范

**格式**: `<type>[scope]: <description>`

**Type 类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `perf`: 性能优化
- `chore`: 构建/工具链

**示例**:
```bash
# ✅ 好的 commit 信息
git commit -m "feat: add blog search functionality"
git commit -m "fix(header): resolve responsive layout issue"
git commit -m "docs: update README with installation guide"
git commit -m "refactor(posts): extract utility functions"

# ❌ 不好的 commit 信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "wip"
```

### PR 流程

1. 从 `develop` 创建功能分支
2. 开发和测试
3. 提交代码（遵循 commit 规范）
4. 创建 Pull Request
5. Code Review
6. 合并到 `develop`
7. 定期合并 `develop` 到 `main`

---

## 🎨 样式规范

### Tailwind CSS

```tsx
// ✅ 直接使用实用类
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded shadow">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>

// ✅ 响应式设计
<div className="text-sm md:text-base lg:text-lg">
  Content
</div>

// ✅ 暗色模式
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

### 类名顺序

建议顺序：
1. 布局 (`flex`, `grid`, `block`)
2. 尺寸 (`w-full`, `h-10`)
3. 间距 (`p-4`, `m-2`, `gap-4`)
4. 排版 (`text-lg`, `font-bold`)
5. 颜色 (`bg-white`, `text-gray-900`)
6. 效果 (`shadow`, `rounded`)
7. 交互 (`hover:bg-gray-100`, `focus:outline-none`)

---

## ⚡ 性能优化

### 图片优化

```tsx
import Image from 'next/image'

// ✅ 使用 Next.js Image 组件
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // 首屏图片
  quality={80}
/>

// ❌ 避免使用 img 标签
<img src="/hero.jpg" alt="Hero" />
```

### 字体优化

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 避免 FOIT
  preload: true,
})

export default function Layout({ children }) {
  return (
    <body className={inter.className}>
      {children}
    </body>
  )
}
```

### 动态导入

```typescript
import dynamic from 'next/dynamic'

// ✅ 重型组件延迟加载
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  ssr: false,  // 不需要服务端渲染
  loading: () => <p>Loading...</p>,
})

// ✅ 条件加载
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  ssr: false,
})
```

### 记忆化

```typescript
import { memo, useMemo, useCallback } from 'react'

// ✅ 避免不必要的重渲染
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item))
  }, [data])
  
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <div onClick={handleClick}>{processedData}</div>
})
```

---

## 🔒 安全规范

### 环境变量

```bash
# .env.local
DATABASE_URL=xxx              # 仅服务端
NEXT_PUBLIC_API_URL=xxx       # 客户端可访问
```

```typescript
// ✅ 正确使用
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ❌ 错误：在服务端代码中使用客户端变量
const dbUrl = process.env.DATABASE_URL // 只能在服务端使用
```

### XSS 防护

```tsx
// ✅ Next.js 默认转义
<div>{userInput}</div>

// ⚠️ 危险：避免直接使用
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 如必须使用，先 sanitization
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 依赖安全

```bash
# 定期检查漏洞
npm audit
npm audit fix

# 更新依赖
ncu -u  # npm-check-updates
```

---

## 📊 代码质量指标

### 目标

| 指标 | 要求 |
|------|------|
| TypeScript 错误 | 0 |
| ESLint 警告 | 0 |
| 测试覆盖率 | > 80% |
| 测试通过率 | 100% |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |
| Lighthouse Best Practices | > 90 |
| Lighthouse SEO | > 90 |

---

## 🔄 持续改进

### Code Review 要点

- [ ] 代码可读性好
- [ ] 符合规范
- [ ] 测试充分
- [ ] 无明显性能问题
- [ ] 安全性考虑

### 技术债务管理

- 记录 TODO 并创建 Issue
- 定期重构和优化
- 保持代码整洁

---

**记住**: 规范是为了提高代码质量和团队协作效率，不是为了增加负担。养成良好的编码习惯！

**版本**: v1.0.0  
**最后更新**: 2024-01-01
