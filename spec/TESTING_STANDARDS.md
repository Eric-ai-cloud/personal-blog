# 🧪 测试规范标准 (Testing Standards)

> **要求**: 所有代码必须包含对应的测试用例  
> **版本**: v1.0.0

---

## 📋 目录

- [测试金字塔](#测试金字塔)
- [分层测试要求](#分层测试要求)
- [测试编写规范](#测试编写规范)
- [覆盖率要求](#覆盖率要求)
- [最佳实践](#最佳实践)
- [禁止事项](#禁止事项)

---

## 🎯 测试金字塔

```
        /\
       /  \
      / E2E \          5-10% - 核心用户流程
     /______\
    /        \
   / Integration \    15-20% - 模块协作
  /________________\
 /                  \
/    Unit Tests      \  70-80% - 单元和组件
/____________________\
```

**原则**:
- ✅ 底层测试（单元）要多
- ✅ 顶层测试（E2E）要少
- ✅ 平衡各层覆盖

---

## 📊 分层测试要求

### 1️⃣ 单元测试 (Unit Tests)

**目标**: 80%+ 代码覆盖率

**测试内容**:
- ✅ 纯函数（数据处理、计算逻辑）
- ✅ 工具类（验证、格式化、转换）
- ✅ 类型守卫和断言
- ✅ 错误处理逻辑

**不测试**:
- ❌ UI 渲染
- ❌ 网络请求
- ❌ 文件系统
- ❌ 浏览器 API

**示例**:
```typescript
// ✅ 好的单元测试
describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    expect(formatDate('2024-01-01')).toBe('2024年1月1日')
  })

  it('应该处理无效输入', () => {
    expect(() => formatDate('invalid')).toThrow()
  })
})

// ❌ 避免在单元测试中
describe('BlogPage', () => {
  it('应该渲染页面', async () => {
    // 这是集成测试，不是单元测试
  })
})
```

---

### 2️⃣ 组件测试 (Component Tests)

**目标**: 70%+ 公共组件覆盖

**测试内容**:
- ✅ 组件渲染
- ✅ Props 传递
- ✅ 用户交互（点击、输入、提交）
- ✅ 状态变化
- ✅ 条件渲染
- ✅ 列表渲染

**优先级**:
1. **P0**: 公共组件（Header, Footer, Layout）
2. **P1**: 业务组件（BlogCard, SearchBox）
3. **P2**: 页面组件（可选，用集成测试替代）

**示例**:
```typescript
describe('SearchBox Component', () => {
  it('应该正确渲染搜索框', () => {
    render(<SearchBox />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('输入时应该显示结果', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockSearch} />)
    
    const input = screen.getByPlaceholderText(/search/i)
    await user.type(input, 'React')
    
    await waitFor(() => {
      expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
    })
  })

  it('按 ESC 应该关闭', async () => {
    // 测试键盘事件
  })
})
```

---

### 3️⃣ 集成测试 (Integration Tests)

**目标**: 关键路径 100% 覆盖

**测试内容**:
- ✅ API 路由和数据获取
- ✅ 完整的数据流（从读取到渲染）
- ✅ 页面间导航
- ✅ 多个组件协作
- ✅ 状态管理

**示例**:
```typescript
describe('Blog Listing Integration', () => {
  it('应该能加载博客列表并显示', async () => {
    render(<BlogPage />)
    
    // 验证数据获取
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).not.toBeInTheDocument()
    })
    
    // 验证列表渲染
    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
    
    // 验证分页
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()
  })

  it('点击文章应该跳转到详情', async () => {
    const user = userEvent.setup()
    render(<BlogPage />)
    
    await waitFor(() => {
      const firstArticle = screen.getAllByRole('article')[0]
      const link = within(firstArticle).getByRole('link')
      await user.click(link)
    })
    
    expect(window.location.pathname).toMatch(/\/blog\/.+/)
  })
})
```

---

### 4️⃣ E2E 测试 (End-to-End)

**目标**: 核心用户流程 100% 覆盖

**测试内容**:
- ✅ 用户访问首页
- ✅ 浏览和搜索文章
- ✅ 阅读文章详情
- ✅ 响应式布局（移动端 + 桌面端）
- ✅ 关键交互流程

**数量控制**: 5-10 个核心场景

**示例**:
```typescript
test.describe('User Journey', () => {
  test('新用户应该能浏览和阅读文章', async ({ page }) => {
    // 1. 访问首页
    await page.goto('/')
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
    
    // 2. 浏览文章列表
    await page.click('text=浏览文章')
    await page.waitForURL('/blog')
    
    // 3. 搜索文章
    await page.keyboard.press('Meta+k')
    await page.fill('input[placeholder*="Search"]', 'React')
    await page.waitForSelector('.search-result')
    
    // 4. 阅读文章
    await page.click('.search-result:first-child')
    await page.waitForURL('/blog/**')
    await expect(page.locator('article')).toBeVisible()
  })

  test('应该支持移动端操作', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // 测试移动端菜单
    await page.click('[aria-label="Open menu"]')
    await expect(page.getByRole('menu')).toBeVisible()
  })
})
```

---

## 📝 测试编写规范

### 1. 测试文件组织

```
src/
├── lib/
│   └── __tests__/
│       ├── posts.test.ts        # 对应 posts.ts
│       └── utils.test.ts        # 对应 utils.ts
├── components/
│   └── __tests__/
│       ├── BlogCard.test.tsx    # 对应 BlogCard.tsx
│       └── Header.test.tsx      # 对应 Header.tsx
└── tests/
    ├── setup.ts                 # 全局配置
    ├── mocks.ts                 # Mock 数据
    └── helpers.ts               # 测试工具
```

### 2. 测试命名规范

```typescript
// ✅ 好的测试名称
it('应该根据 slug 获取已发布的文章')
it('空查询应该返回空数组')
it('无效日期应该抛出异常')
it('应该在 100ms 内完成搜索')

// ❌ 不好的测试名称
it('测试1')
it('获取文章')
it('正常工作')
it('应该工作')
```

**格式模板**:
```
应该 [预期行为] [条件/场景]
```

### 3. AAA 模式

```typescript
it('应该正确计算购物车总价', () => {
  // Arrange - 准备数据
  const cart: CartItem[] = [
    { product: { price: 100 }, quantity: 2 },
    { product: { price: 50 }, quantity: 3 }
  ]
  
  // Act - 执行操作
  const total = calculateTotal(cart)
  
  // Assert - 验证结果
  expect(total).toBe(350)
})
```

### 4. 测试隔离

```typescript
// ✅ 每个测试独立
describe('SearchIndex', () => {
  let index: SearchIndex
  
  beforeEach(() => {
    // 每个测试前重新初始化
    index = new SearchIndex()
    index.build(mockData)
  })
  
  it('测试1', () => { /* ... */ })
  it('测试2', () => { /* ... */ })
})

// ❌ 测试间共享状态
let sharedIndex = new SearchIndex()
it('测试1', () => { sharedIndex.add(...) })
it('测试2', () => { /* 依赖测试1的状态 - 危险！ */ })
```

---

## 📈 覆盖率要求

### 最低覆盖率标准

| 测试类型 | 语句 | 分支 | 函数 | 行 |
|---------|------|------|------|----|
| 核心工具 | 90% | 85% | 95% | 90% |
| 公共组件 | 80% | 75% | 85% | 80% |
| 业务代码 | 75% | 70% | 80% | 75% |
| 页面组件 | 60% | 50% | 70% | 60% |

### 查看覆盖率

```bash
# 运行测试并生成报告
npm run test:coverage

# 打开 HTML 报告
open coverage/index.html
```

### 覆盖率阈值配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

---

## ✅ 最佳实践

### 1. 测试有意义的行为

```typescript
// ✅ 测试用户关心的行为
it('应该显示搜索结果', async () => {
  await user.type(input, 'React')
  expect(await screen.findAllByRole('option')).toHaveLength(5)
})

// ❌ 测试实现细节
it('应该调用 useEffect', () => {
  // 用户不关心这个
})
```

### 2. 使用有意义的断言

```typescript
// ✅ 具体的断言
expect(result.title).toBe('Expected Title')
expect(results).toHaveLength(10)
expect(score).toBeGreaterThan(0.8)

// ❌ 模糊的断言
expect(result).toBeTruthy()
expect(result).toBeDefined()
```

### 3. 一个测试只测一件事

```typescript
// ✅ 好的做法
it('应该正确渲染标题', () => {
  render(<BlogCard {...props} />)
  expect(screen.getByText(props.title)).toBeInTheDocument()
})

it('应该正确渲染描述', () => {
  render(<BlogCard {...props} />)
  expect(screen.getByText(props.description)).toBeInTheDocument()
})

// ❌ 不好的做法
it('应该渲染所有内容', () => {
  render(<BlogCard {...props} />)
  expect(screen.getByText(props.title)).toBeInTheDocument()
  expect(screen.getByText(props.description)).toBeInTheDocument()
  expect(screen.getByText(props.date)).toBeInTheDocument()
  // ... 太多断言
})
```

### 4. 使用 Factory 函数创建测试数据

```typescript
// ✅ 好的做法
function createMockPost(overrides?: Partial<BlogPost>): BlogPost {
  return {
    slug: 'test-post',
    title: 'Test Post',
    description: 'Test Description',
    date: '2024-01-01',
    published: true,
    ...overrides
  }
}

// 使用
const post1 = createMockPost()
const post2 = createMockPost({ title: 'Custom Title' })
const post3 = createMockPost({ published: false })
```

### 5. Mock 外部依赖

```typescript
// ✅ Mock API 调用
vi.mock('@/lib/api', () => ({
  fetchPosts: vi.fn().mockResolvedValue(mockPosts),
}))

// ✅ Mock 文件系统
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('mock content'),
}))
```

---

## ❌ 禁止事项

### 1. 禁止跳过测试

```typescript
// ❌ 禁止
it.skip('应该处理边界情况', () => {
  // 跳过的测试
})

// ✅ 如果暂时无法实现，记录原因
it.todo('应该处理边界情况 - 等待 API 上线')
```

### 2. 禁止硬编码魔法数字

```typescript
// ❌ 不好
expect(results.length).toBe(5)

// ✅ 定义常量
const EXPECTED_RESULT_COUNT = 5
expect(results.length).toBe(EXPECTED_RESULT_COUNT)
```

### 3. 禁止测试依赖于执行顺序

```typescript
// ❌ 危险
let counter = 0
it('测试1', () => { counter++ })
it('测试2', () => { expect(counter).toBe(1) }) // 依赖测试1

// ✅ 独立
it('测试1', () => { expect(func(1)).toBe(2) })
it('测试2', () => { expect(func(2)).toBe(4) })
```

### 4. 禁止忽略失败的测试

```typescript
// ❌ 禁止
// test.fail() without fixing the issue

// ✅ 如果确实需要标记失败，创建 Issue 并说明原因
it.failing('已知问题 - Issue #123', () => {
  // 记录失败原因
})
```

---

## 🔧 测试工具速查

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
expect(() => func()).toThrow()
expect(() => func()).toThrowError('message')

// DOM
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toHaveTextContent('text')
expect(element).toBeVisible()
expect(element).toBeDisabled()
```

### 常用 Mock

```typescript
// Mock 函数
const mockFn = vi.fn()
mockFn.mockReturnValue(value)
mockFn.mockResolvedValue(promiseValue)
mockFn.mockRejectedValue(error)

// Mock 模块
vi.mock('module-name', () => ({
  default: vi.fn(),
  exportName: vi.fn(),
}))

// Mock 定时器
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.runAllTimers()
```

---

## 📖 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldberz/awesome-testing)

---

**记住**: 测试是代码质量的保障，没有测试的代码就是 buggy 的代码！

**版本**: v1.0.0  
**最后更新**: 2024-01-01
