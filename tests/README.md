# 🧪 测试中心 (Tests Center)

> **用途**: 集中管理所有测试方案、测试用例和测试配置  
> **版本**: v1.0.0  
> **最后更新**: 2024-01-01

---

## 📋 目录结构

```
tests/
├── README.md                    # 测试中心索引（本文档）
│
├── unit/                        # 单元测试
│   ├── lib/                     # 工具函数测试
│   │   ├── posts.test.ts        # posts.ts 测试
│   │   └── utils.test.ts        # utils.ts 测试
│   └── types/                   # 类型定义测试
│       └── validation.test.ts   # 类型验证测试
│
├── components/                  # 组件测试
│   ├── BlogCard.test.tsx        # BlogCard 组件测试
│   ├── Header.test.tsx          # Header 组件测试
│   └── SearchBox.test.tsx       # SearchBox 组件测试
│
├── integration/                 # 集成测试
│   ├── blog-flow.test.tsx       # 博客流程测试
│   ├── data-flow.test.ts        # 数据流测试
│   └── api-routes.test.ts       # API 路由测试
│
├── e2e/                         # E2E 测试
│   ├── homepage.spec.ts         # 首页 E2E
│   ├── blog-reading.spec.ts     # 文章阅读 E2E
│   └── search.spec.ts           # 搜索功能 E2E
│
├── fixtures/                    # 测试数据
│   ├── mock-posts.ts            # Mock 文章数据
│   ├── mock-users.ts            # Mock 用户数据
│   └── index.ts                 # 数据导出
│
├── helpers/                     # 测试工具
│   ├── render.tsx               # 测试渲染辅助
│   ├── mocks.ts                 # Mock 配置
│   └── assertions.ts            # 自定义断言
│
└── setup/                       # 测试配置
    ├── vitest.setup.ts          # Vitest 配置
    ├── playwright.config.ts     # Playwright 配置
    └── global.d.ts              # 全局类型
```

---

## 🎯 测试分类

### 1️⃣ 单元测试 (unit/)

**位置**: `tests/unit/`

**目标**: 80%+ 代码覆盖率

**测试内容**:
- ✅ 纯函数（数据处理、计算逻辑）
- ✅ 工具类（验证、格式化、转换）
- ✅ 类型守卫和断言
- ✅ 错误处理逻辑

**示例**:
```typescript
// tests/unit/lib/posts.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/posts'

describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    expect(formatDate('2024-01-01')).toBe('2024年1月1日')
  })
})
```

---

### 2️⃣ 组件测试 (components/)

**位置**: `tests/components/`

**目标**: 70%+ 公共组件覆盖

**测试内容**:
- ✅ 组件渲染
- ✅ Props 传递
- ✅ 用户交互（点击、输入、提交）
- ✅ 状态变化
- ✅ 条件渲染

**示例**:
```typescript
// tests/components/BlogCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BlogCard } from '@/components/BlogCard'

describe('BlogCard', () => {
  it('应该正确渲染文章卡片', () => {
    render(<BlogCard title="Test" description="Desc" date="2024-01-01" slug="test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

---

### 3️⃣ 集成测试 (integration/)

**位置**: `tests/integration/`

**目标**: 关键路径 100% 覆盖

**测试内容**:
- ✅ API 路由和数据获取
- ✅ 完整的数据流
- ✅ 页面间导航
- ✅ 多个组件协作
- ✅ 状态管理

**示例**:
```typescript
// tests/integration/blog-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import BlogPage from '@/app/blog/page'

describe('Blog Flow Integration', () => {
  it('应该能加载博客列表并显示', async () => {
    render(<BlogPage />)
    await waitFor(() => {
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    })
  })
})
```

---

### 4️⃣ E2E 测试 (e2e/)

**位置**: `tests/e2e/`

**目标**: 核心用户流程 100% 覆盖

**测试内容**:
- ✅ 用户访问首页
- ✅ 浏览和搜索文章
- ✅ 阅读文章详情
- ✅ 响应式布局
- ✅ 关键交互流程

**示例**:
```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage E2E', () => {
  test('用户应该能访问首页', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
  })
})
```

---

## 📊 测试数据管理

### Fixtures (fixtures/)

**位置**: `tests/fixtures/`

**用途**: 统一管理测试数据

**示例**:
```typescript
// tests/fixtures/mock-posts.ts
export const mockPosts = [
  {
    slug: 'first-post',
    title: 'First Post',
    description: 'This is the first post',
    date: '2024-01-01',
    published: true,
    tags: ['intro', 'welcome']
  },
  // ... 更多 mock 数据
]

// tests/fixtures/index.ts
export * from './mock-posts'
export * from './mock-users'
```

---

## 🛠️ 测试工具

### Helpers (helpers/)

**位置**: `tests/helpers/`

**用途**: 提供测试辅助函数

**示例**:
```typescript
// tests/helpers/render.tsx
import { render as rtlRender } from '@testing-library/react'

export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    // 自定义包装器
    wrapper: ({ children }) => <CustomProvider>{children}</CustomProvider>,
    ...options,
  })
}

// tests/helpers/mocks.ts
import { vi } from 'vitest'

export function createMockRouter(overrides = {}) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
    query: {},
    ...overrides,
  }
}
```

---

## ⚙️ 测试配置

### Setup (setup/)

**位置**: `tests/setup/`

**用途**: 测试框架配置

**文件**:
- `vitest.setup.ts` - Vitest 全局配置
- `playwright.config.ts` - Playwright 配置
- `global.d.ts` - 全局类型定义

---

## 🚀 运行测试

### 常用命令

```bash
# 运行所有测试
npm test

# 监听模式（开发时推荐）
npm run test:ui

# 生成覆盖率报告
npm run test:coverage

# 运行一次并退出
npm run test:run

# 只运行单元测试
npm run test:unit

# 只运行组件测试
npm run test:components

# 只运行集成测试
npm run test:integration

# 只运行 E2E 测试
npm run test:e2e
```

---

## 📝 编写测试的最佳实践

### 1. 测试文件组织

```
✅ 好的做法
tests/
├── unit/lib/posts.test.ts      # 对应 src/lib/posts.ts
├── components/BlogCard.test.tsx # 对应 src/components/BlogCard.tsx
└── integration/blog-flow.test.tsx

❌ 不好的做法
tests/
├── test1.ts
├── my-test.ts
└── random.spec.ts
```

### 2. 测试命名规范

```typescript
// ✅ 清晰的测试名称
it('应该根据 slug 获取已发布的文章')
it('空查询应该返回空数组')
it('无效日期应该抛出异常')

// ❌ 模糊的测试名称
it('测试1')
it('获取文章')
it('正常工作')
```

### 3. 使用测试数据

```typescript
// ✅ 从 fixtures 导入
import { mockPosts } from '@/tests/fixtures/mock-posts'

// ❌ 硬编码测试数据
const posts = [
  { slug: 'post-1', title: 'Post 1', ... }
]
```

### 4. 测试隔离

```typescript
// ✅ 每个测试独立
describe('SearchIndex', () => {
  let index: SearchIndex
  
  beforeEach(() => {
    index = new SearchIndex()
    index.build(mockData)
  })
  
  it('测试1', () => { /* ... */ })
  it('测试2', () => { /* ... */ })
})

// ❌ 测试间共享状态
let sharedIndex = new SearchIndex()
it('测试1', () => { sharedIndex.add(...) })
it('测试2', () => { /* 依赖测试1的状态 */ })
```

---

## 📈 覆盖率要求

### 最低标准

| 测试类型 | 语句 | 分支 | 函数 | 行 |
|---------|------|------|------|----|
| 核心工具 | 90% | 85% | 95% | 90% |
| 公共组件 | 80% | 75% | 85% | 80% |
| 业务代码 | 75% | 70% | 80% | 75% |
| 页面组件 | 60% | 50% | 70% | 60% |

### 查看覆盖率

```bash
# 生成覆盖率报告
npm run test:coverage

# 打开 HTML 报告
open coverage/index.html
```

---

## 🔗 相关文档

- 📘 [spec/TESTING_GUIDE.md](../spec/TESTING_GUIDE.md) - 完整测试指南
- 📘 [spec/TESTING_STANDARDS.md](../spec/TESTING_STANDARDS.md) - 测试规范标准
- 📘 [spec/TEST_CHECKLIST.md](../spec/TEST_CHECKLIST.md) - 测试检查清单
- 📘 [spec/SPEC_TEMPLATE.md](../spec/SPEC_TEMPLATE.md) - Spec 模板（包含测试策略）

---

## 💡 快速开始

### 添加新测试的步骤

1. **确定测试类型**
   - 单元测试 → `tests/unit/`
   - 组件测试 → `tests/components/`
   - 集成测试 → `tests/integration/`
   - E2E 测试 → `tests/e2e/`

2. **创建测试文件**
   ```bash
   # 例如：为 BlogCard 组件添加测试
   touch tests/components/BlogCard.test.tsx
   ```

3. **编写测试**
   ```typescript
   import { describe, it, expect } from 'vitest'
   
   describe('BlogCard', () => {
     it('应该正确渲染', () => {
       // 测试代码
     })
   })
   ```

4. **运行测试**
   ```bash
   npm test
   ```

5. **检查覆盖率**
   ```bash
   npm run test:coverage
   ```

---

## ✨ 测试模板

### 单元测试模板

```typescript
// tests/unit/[module].test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { functionToTest } from '@/lib/module'

describe('[模块名称]', () => {
  describe('[函数名称]', () => {
    it('应该正确处理正常输入', () => {
      const result = functionToTest(validInput)
      expect(result).toBe(expectedOutput)
    })

    it('应该处理边界情况', () => {
      const result = functionToTest(edgeCaseInput)
      expect(result).toBe(expectedEdgeCaseOutput)
    })

    it('应该抛出适当的异常', () => {
      expect(() => functionToTest(invalidInput)).toThrow()
    })
  })
})
```

### 组件测试模板

```typescript
// tests/components/[Component].test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Component } from '@/components/Component'

describe('[组件名称]', () => {
  it('应该正确渲染', () => {
    render(<Component {...mockProps} />)
    expect(screen.getByText(/expected text/i)).toBeInTheDocument()
  })

  it('应该响应用户交互', async () => {
    const user = userEvent.setup()
    render(<Component {...mockProps} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(onClickMock).toHaveBeenCalled()
  })
})
```

---

## 📞 需要帮助？

- 📖 查看 [spec/TESTING_GUIDE.md](../spec/TESTING_GUIDE.md)
- 📖 查看 [spec/TESTING_STANDARDS.md](../spec/TESTING_STANDARDS.md)
- 💬 团队讨论
- 🔍 搜索最佳实践

---

**记住**: 测试是代码质量的保障！没有测试的代码就是 buggy 的代码。

**版本**: v1.0.0  
**创建日期**: 2024-01-01  
**维护者**: Personal Blog Team
