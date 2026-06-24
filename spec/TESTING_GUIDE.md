# 🧪 测试指南 (Testing Guide)

> **原则**: 所有工作产出都必须包含对应的测试用例

---

## 📋 目录

- [快速开始](#快速开始)
- [测试结构](#测试结构)
- [单元测试](#单元测试)
- [组件测试](#组件测试)
- [集成测试](#集成测试)
- [E2E测试](#e2e测试)
- [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时推荐）
npm run test:ui

# 生成覆盖率报告
npm run test:coverage

# 运行一次并退出
npm run test:run
```

### 测试文件位置

```
src/
├── lib/
│   └── __tests__/          # 工具函数测试
│       ├── posts.test.ts
│       └── utils.test.ts
├── components/
│   └── __tests__/          # 组件测试
│       ├── BlogCard.test.tsx
│       └── Header.test.tsx
└── tests/                  # 通用测试配置
    ├── setup.ts
    └── mocks.ts
```

---

## 📁 测试结构

### 测试文件命名

```typescript
// ✅ 正确
src/lib/__tests__/posts.test.ts
src/components/__tests__/BlogCard.test.tsx

// ❌ 错误
src/lib/posts.spec.ts
src/tests/BlogCard.test.tsx
```

### 测试组织结构

```typescript
describe('模块名称', () => {
  describe('函数/功能名称', () => {
    it('应该描述预期行为', () => {
      // 测试代码
    })
  })
})
```

---

## 🧩 单元测试

### 测试纯函数

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { slugify, truncate } from '../utils'

describe('slugify', () => {
  it('应该将标题转换为 URL 友好的 slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('React Hooks 完全指南')).toBe('react-hooks-wan-quan-zhi-nan')
  })

  it('应该处理特殊字符', () => {
    expect(slugify('C++ vs Java')).toBe('c-vs-java')
    expect(slugify("What's New")).toBe('what-s-new')
  })

  it('应该处理空字符串', () => {
    expect(slugify('')).toBe('')
  })
})

describe('truncate', () => {
  it('应该截断过长的文本', () => {
    const longText = 'A'.repeat(100)
    expect(truncate(longText, 50)).toHaveLength(53) // 50 + '...'
  })

  it('不应该截断短文本', () => {
    expect(truncate('Short', 100)).toBe('Short')
  })

  it('应该添加省略号', () => {
    const result = truncate('A'.repeat(100), 50)
    expect(result).endsWith('...')
  })
})
```

### 测试数据处理逻辑

```typescript
// src/lib/__tests__/posts.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getAllPosts, getPostBySlug } from '../posts'

describe('getAllPosts', () => {
  it('应该返回文章数组', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
  })

  it('应该按日期倒序排列', () => {
    const posts = getAllPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime())
        .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
    }
  })

  it('应该只返回已发布的文章', () => {
    const posts = getAllPosts()
    posts.forEach(post => {
      expect(post.published).toBe(true)
    })
  })
})

describe('getPostBySlug', () => {
  it('应该根据 slug 获取文章', () => {
    const post = getPostBySlug('first-post')
    expect(post).not.toBeNull()
    expect(post?.data.title).toBeDefined()
  })

  it('不存在的 slug 应该返回 null', () => {
    const post = getPostBySlug('non-existent')
    expect(post).toBeNull()
  })
})
```

---

## 🎨 组件测试

### 测试组件渲染

```typescript
// src/components/__tests__/BlogCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogCard } from '../BlogCard'

describe('BlogCard', () => {
  const mockProps = {
    title: 'Test Post',
    description: 'This is a test description',
    date: '2024-01-01',
    slug: 'test-post',
    tags: ['react', 'typescript']
  }

  it('应该正确渲染文章卡片', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
    expect(screen.getByText('2024年1月1日')).toBeInTheDocument()
  })

  it('应该显示标签', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#typescript')).toBeInTheDocument()
  })
})
```

### 测试用户交互

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('BlogCard Interactions', () => {
  it('点击标题应该导航到文章详情', async () => {
    const user = userEvent.setup()
    render(<BlogCard {...mockProps} />)
    
    const link = screen.getByRole('link', { name: /test post/i })
    await user.click(link)
    
    // 验证导航行为（需要 mock next/link）
  })

  it('鼠标悬停应该有视觉效果', async () => {
    const user = userEvent.setup()
    render(<BlogCard {...mockProps} />)
    
    const card = screen.getByRole('article')
    await user.hover(card)
    
    expect(card).toHaveClass('hover:shadow-lg')
  })
})
```

### 测试边界情况

```typescript
describe('BlogCard Edge Cases', () => {
  it('应该处理没有标签的情况', () => {
    const propsWithoutTags = { ...mockProps, tags: undefined }
    render(<BlogCard {...propsWithoutTags} />)
    
    expect(screen.queryByText(/#\w+/)).not.toBeInTheDocument()
  })

  it('应该处理很长的标题', () => {
    const longTitle = 'A'.repeat(100)
    const propsWithLongTitle = { ...mockProps, title: longTitle }
    render(<BlogCard {...propsWithLongTitle} />)
    
    // 验证长标题被正确处理
    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })

  it('应该处理缺失的描述', () => {
    const propsWithoutDesc = { ...mockProps, description: '' }
    render(<BlogCard {...propsWithoutDesc} />)
    
    // 不应该抛出错误
    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
  })
})
```

---

## 🔗 集成测试

### 测试页面流程

```typescript
// tests/integration/blog-listing.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BlogPage from '@/app/blog/page'

describe('Blog Listing Integration', () => {
  it('应该能加载博客列表页', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/博客文章/i)).toBeInTheDocument()
    })
    
    // 验证文章列表渲染
    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
  })

  it('应该显示正确的文章数量', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      const countText = screen.getByText(/共 (\d+) 篇文章/)
      expect(countText).toBeInTheDocument()
    })
  })
})
```

### 测试数据流

```typescript
// tests/integration/data-flow.test.ts
import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

describe('Data Flow', () => {
  it('应该能从列表获取文章并获取详情', () => {
    // 1. 获取列表
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)
    
    // 2. 获取第一篇文章的详情
    const firstPost = posts[0]
    const detail = getPostBySlug(firstPost.slug)
    
    expect(detail).not.toBeNull()
    expect(detail?.data.slug).toBe(firstPost.slug)
  })
})
```

---

## 🎭 E2E测试

### 使用 Playwright

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('应该能成功访问首页', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
  })

  test('应该能浏览博客文章', async ({ page }) => {
    await page.goto('/blog')
    
    // 验证文章列表
    const articles = page.locator('article')
    await expect(articles.first()).toBeVisible()
  })

  test('应该能阅读文章详情', async ({ page }) => {
    await page.goto('/blog/first-post')
    
    // 验证文章内容
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('应该支持响应式布局', async ({ page }) => {
    await page.goto('/')
    
    // 移动端视图
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
    
    // 桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
  })
})
```

---

## 📊 Mock 和 Stub

### Mock 外部依赖

```typescript
// src/tests/mocks.ts
import { vi } from 'vitest'

// Mock fs 模块
export const mockFs = {
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  existsSync: vi.fn(),
}

vi.mock('fs', () => ({
  default: mockFs,
  readFileSync: mockFs.readFileSync,
  readdirSync: mockFs.readdirSync,
  existsSync: mockFs.existsSync,
}))
```

### Mock Next.js 模块

```typescript
// 在 setup.ts 中
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => 
    `<img src="${src}" alt="${alt}" />`,
}))
```

---

## ✅ 最佳实践

### 1. 测试命名

```typescript
// ✅ 好的测试名称
it('应该根据 slug 获取已发布的文章')
it('不存在的 slug 应该返回 null')
it('空查询应该返回空数组')

// ❌ 不好的测试名称
it('测试1')
it('获取文章')
it('正常工作')
```

### 2. AAA 模式

```typescript
it('应该正确计算总价', () => {
  // Arrange - 准备
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 3 }
  ]
  
  // Act - 执行
  const total = calculateTotal(items)
  
  // Assert - 断言
  expect(total).toBe(350)
})
```

### 3. 测试隔离

```typescript
// ✅ 每个测试独立
describe('SearchIndex', () => {
  let searchIndex: SearchIndex
  
  beforeEach(() => {
    // 每个测试前重新初始化
    searchIndex = new SearchIndex()
  })
  
  it('测试1', () => { /* ... */ })
  it('测试2', () => { /* ... */ })
})

// ❌ 测试间共享状态
let sharedState = {}
it('测试1', () => { sharedState.value = 1 })
it('测试2', () => { console.log(sharedState.value) }) // 可能失败
```

### 4. 有意义的断言

```typescript
// ✅ 具体的断言
expect(result.title).toBe('Expected Title')
expect(result.items).toHaveLength(5)
expect(result.score).toBeGreaterThan(0.8)

// ❌ 模糊的断言
expect(result).toBeTruthy()
expect(result).toBeDefined()
```

### 5. 测试边界情况

```typescript
describe('ArrayUtils.first', () => {
  it('应该返回数组第一个元素', () => {
    expect(first([1, 2, 3])).toBe(1)
  })
  
  it('空数组应该返回 undefined', () => {
    expect(first([])).toBeUndefined()
  })
  
  it('应该处理单元素数组', () => {
    expect(first([42])).toBe(42)
  })
  
  it('应该处理null/undefined元素', () => {
    expect(first([null, undefined, 1])).toBeNull()
  })
})
```

---

## 🔧 测试工具

### 常用断言

```typescript
// 相等性
expect(value).toBe(expected)
expect(value).toEqual(object)

// 真假值
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// 数字
expect(number).toBeGreaterThan(10)
expect(number).toBeLessThan(100)
expect(number).toBeCloseTo(3.14, 2)

// 字符串
expect(string).toContain('substring')
expect(string).toMatch(/regex/)

// 数组
expect(array).toContain(item)
expect(array).toHaveLength(5)

// 对象
expect(object).toHaveProperty('key')
expect(object).toHaveProperty('key', 'value')

// 异常
expect(() => functionCall()).toThrow()
expect(() => functionCall()).toThrowError('message')

// DOM
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toHaveTextContent('text')
```

---

## 📈 覆盖率要求

### 目标指标

```
✅ 语句覆盖率 (Statements): > 80%
✅ 分支覆盖率 (Branches): > 80%
✅ 函数覆盖率 (Functions): > 80%
✅ 行覆盖率 (Lines): > 80%
```

### 查看覆盖率

```bash
# 运行测试并生成覆盖率报告
npm run test:coverage

# 打开 HTML 报告
open coverage/index.html
```

---

## 🚀 下一步

- [ ] 为核心工具函数编写测试
- [ ] 为所有组件编写测试
- [ ] 设置 CI/CD 自动测试
- [ ] 添加视觉回归测试
- [ ] 完善 E2E 测试覆盖

---

**记住**: 没有测试的代码就是 buggy 的代码！

**版本**: v1.0.0  
**最后更新**: 2024-01-01
