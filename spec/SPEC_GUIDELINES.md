# 📋 Spec 讨论与测试驱动开发规范

> **目的**: 确保所有功能开发都经过充分的规格讨论，并包含完整的测试用例

---

## 🎯 开发工作流程

### 标准流程

```
需求提出 
    ↓
📋 Spec 讨论与确认 ← 必须先进行这一步
    ↓
📐 技术方案设计
    ↓
🧪 测试用例编写 ← 在实现之前先写测试
    ↓
💻 代码实现
    ↓
✅ 测试验证
    ↓
📝 文档更新
    ↓
🔍 Code Review
    ↓
🚀 部署上线
```

**关键原则**:
1. ✅ **Spec 先行** - 任何功能开发前必须先有明确的规格
2. ✅ **测试驱动** - 所有产出必须包含测试用例
3. ✅ **文档同步** - Spec 确认后同步更新文档

---

## 📝 Spec 讨论模板

### Spec 讨论检查清单

当提出新功能或修改时，需要明确以下内容：

#### 1️⃣ 需求分析
- [ ] **功能目标**: 要实现什么？解决什么问题？
- [ ] **用户场景**: 谁会使用？如何使用？
- [ ] **业务价值**: 为什么需要这个功能？
- [ ] **优先级**: P0/P1/P2/P3

#### 2️⃣ 技术方案
- [ ] **技术选型**: 使用什么技术/库？为什么？
- [ ] **架构影响**: 对现有架构的影响？
- [ ] **性能考虑**: 性能要求和优化点？
- [ ] **安全考虑**: 安全风险和防护措施？

#### 3️⃣ API/接口设计
- [ ] **输入参数**: 需要什么参数？类型？验证规则？
- [ ] **输出结果**: 返回什么数据？格式？
- [ ] **错误处理**: 可能的错误情况？错误码？
- [ ] **兼容性**: 是否需要向后兼容？

#### 4️⃣ 数据结构
- [ ] **数据模型**: 核心数据结构定义
- [ ] **数据存储**: 如何存储？数据库结构？
- [ ] **数据迁移**: 是否需要数据迁移？
- [ ] **边界条件**: 数据的边界情况？

#### 5️⃣ 用户体验
- [ ] **交互流程**: 用户如何操作？
- [ ] **UI/UX**: 界面设计要求？
- [ ] **响应式设计**: 移动端适配要求？
- [ ] **无障碍访问**: a11y 要求？

#### 6️⃣ 测试策略
- [ ] **单元测试**: 需要测试哪些函数/模块？
- [ ] **集成测试**: 模块间如何协作？
- [ ] **E2E测试**: 关键用户流程？
- [ ] **性能测试**: 性能指标要求？
- [ ] **边界测试**: 边界情况覆盖？

#### 7️⃣ 风险评估
- [ ] **技术风险**: 可能的技术难点？
- [ ] **时间风险**: 预估开发时间？
- [ ] **依赖风险**: 第三方依赖的可靠性？
- [ ] **回滚方案**: 出问题的回滚计划？

---

## 🧪 测试用例规范

### 测试金字塔

```
        /\
       /  \
      / E2E \          少量关键流程 E2E 测试
     /______\
    /        \
   /  Integration \    中量集成测试
  /________________\
 /                  \
/    Unit Tests      \  大量单元测试
/____________________\
```

### 测试覆盖要求

#### 1️⃣ 单元测试 (Unit Tests)
**目标**: 80%+ 代码覆盖率

**测试内容**:
- ✅ 工具函数（纯函数）
- ✅ 数据处理逻辑
- ✅ 类型转换函数
- ✅ 验证函数

**示例**:
```typescript
// src/lib/__tests__/posts.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, getAllPosts, getPostBySlug } from '../posts'

describe('Posts Utils', () => {
  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      expect(formatDate('2024-01-01')).toBe('2024年1月1日')
    })

    it('应该处理无效日期', () => {
      expect(() => formatDate('invalid')).toThrow()
    })
  })

  describe('getAllPosts', () => {
    it('应该返回按日期排序的文章列表', () => {
      const posts = getAllPosts()
      expect(posts).toBeInstanceOf(Array)
      expect(posts.length).toBeGreaterThan(0)
    })

    it('应该只返回已发布的文章', () => {
      const posts = getAllPosts()
      posts.forEach(post => {
        expect(post.published).toBe(true)
      })
    })
  })
})
```

#### 2️⃣ 组件测试 (Component Tests)
**目标**: 所有组件都有基本测试

**测试内容**:
- ✅ 组件渲染
- ✅ Props 传递
- ✅ 用户交互（点击、输入等）
- ✅ 状态变化
- ✅ 条件渲染

**示例**:
```typescript
// src/components/__tests__/BlogCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogCard } from '../BlogCard'

describe('BlogCard Component', () => {
  const mockProps = {
    title: 'Test Post',
    description: 'Test Description',
    date: '2024-01-01',
    slug: 'test-post'
  }

  it('应该正确渲染文章卡片', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('点击标题应该导航到文章详情', () => {
    render(<BlogCard {...mockProps} />)
    
    fireEvent.click(screen.getByRole('link'))
    // 验证导航行为
  })
})
```

#### 3️⃣ 集成测试 (Integration Tests)
**目标**: 验证模块间协作

**测试内容**:
- ✅ API 路由测试
- ✅ 数据获取流程
- ✅ 页面完整渲染
- ✅ 路由跳转

**示例**:
```typescript
// tests/integration/blog-flow.test.ts
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPage from '@/app/blog/page'

describe('Blog Flow Integration', () => {
  it('应该能访问博客列表页', async () => {
    render(<BlogPage />)
    
    // 验证页面加载
    expect(await screen.findByText(/博客文章/i)).toBeInTheDocument()
    
    // 验证文章列表渲染
    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
  })

  it('应该能从列表页跳转到详情页', async () => {
    // 测试完整流程
  })
})
```

#### 4️⃣ E2E 测试 (End-to-End)
**目标**: 关键用户流程

**测试内容**:
- ✅ 用户访问首页
- ✅ 浏览文章列表
- ✅ 阅读文章详情
- ✅ 搜索功能（如有）
- ✅ 响应式布局

**示例**:
```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage E2E', () => {
  test('应该能成功访问首页', async ({ page }) => {
    await page.goto('/')
    
    // 验证页面标题
    await expect(page.getByText('欢迎来到我的博客')).toBeVisible()
    
    // 验证导航链接
    await expect(page.getByText('浏览文章')).toBeVisible()
  })

  test('应该能浏览博客文章', async ({ page }) => {
    await page.goto('/blog')
    
    // 验证文章列表
    const articles = page.locator('article')
    await expect(articles.first()).toBeVisible()
  })
})
```

---

## 📊 测试质量指标

### 覆盖率要求

| 测试类型 | 覆盖率要求 | 说明 |
|---------|-----------|------|
| 单元测试 | 80%+ | 核心工具函数 100% |
| 组件测试 | 70%+ | 所有公共组件 |
| 集成测试 | 关键路径 100% | API 和数据流 |
| E2E测试 | 核心流程 100% | 用户主要操作路径 |

### 代码质量指标

```
✅ 零 TypeScript 错误
✅ 零 ESLint 警告
✅ 测试通过率 100%
✅ 测试覆盖率 > 80%
✅ 无 console.error/warn
✅ Lighthouse 评分 > 90
```

---

## 🔧 测试工具链配置

### 推荐的测试栈

```json
{
  "测试框架": {
    "单元测试": "Vitest",
    "组件测试": "React Testing Library",
    "E2E测试": "Playwright"
  },
  "断言库": "Expect (built-in)",
  "Mock工具": "Vitest mocks",
  "覆盖率报告": "Vitest coverage",
  "CI集成": "GitHub Actions"
}
```

### 配置文件示例

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
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

## 📋 Spec 讨论实例

### 示例：添加"文章搜索"功能

#### 1️⃣ 需求分析
```markdown
**功能目标**: 
- 允许用户通过关键词搜索博客文章

**用户场景**:
- 用户在搜索框输入关键词
- 实时显示匹配的文章
- 支持标题和内容搜索

**业务价值**:
- 提升用户体验
- 帮助用户快速找到相关内容

**优先级**: P1
```

#### 2️⃣ 技术方案
```markdown
**技术选型**:
- 前端搜索: Fuse.js (模糊搜索)
- 索引构建: 静态生成时创建
- 缓存策略: 客户端内存缓存

**架构影响**:
- 新增 SearchBox 组件
- 修改博客列表页支持搜索
- 不影响现有功能

**性能考虑**:
- 搜索响应时间 < 100ms
- 索引大小 < 1MB
```

#### 3️⃣ API/接口设计
```typescript
// 接口定义
interface SearchResult {
  slug: string
  title: string
  excerpt: string
  score: number
}

interface SearchIndex {
  build(posts: BlogPost[]): void
  search(query: string): SearchResult[]
}

// 使用方式
const results = searchIndex.search('React Hooks')
```

#### 4️⃣ 数据结构
```typescript
// 搜索索引结构
interface SearchDocument {
  id: string
  title: string
  content: string
  tags: string[]
}

// 搜索结果结构
interface SearchResult {
  slug: string
  title: string
  excerpt: string  // 高亮片段
  score: number    // 相关性分数
  matchedFields: string[]
}
```

#### 5️⃣ 测试策略
```markdown
**单元测试**:
- ✅ searchIndex.build() 正确构建索引
- ✅ searchIndex.search() 返回正确结果
- ✅ 空查询处理
- ✅ 特殊字符处理
- ✅ 大小写处理

**组件测试**:
- ✅ SearchBox 组件渲染
- ✅ 输入事件处理
- ✅ 搜索结果展示
- ✅ 加载状态显示

**集成测试**:
- ✅ 搜索功能端到端测试
- ✅ 搜索结果与列表集成

**E2E测试**:
- ✅ 用户搜索完整流程
- ✅ 响应式搜索框测试
```

#### 6️⃣ 测试用例详细设计

```typescript
// src/lib/__tests__/search.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { SearchIndex } from '../search'

describe('SearchIndex', () => {
  let searchIndex: SearchIndex
  const mockPosts = [
    {
      slug: 'react-hooks',
      title: 'React Hooks 完全指南',
      description: '学习 React Hooks 的使用',
      date: '2024-01-01',
      published: true
    },
    {
      slug: 'typescript-tips',
      title: 'TypeScript 实用技巧',
      description: 'TypeScript 开发最佳实践',
      date: '2024-01-02',
      published: true
    }
  ]

  beforeEach(() => {
    searchIndex = new SearchIndex()
    searchIndex.build(mockPosts)
  })

  describe('build', () => {
    it('应该正确构建搜索索引', () => {
      expect(searchIndex.indexSize).toBe(2)
    })

    it('应该只索引已发布的文章', () => {
      const unpublishedPosts = [...mockPosts, {
        ...mockPosts[0],
        published: false
      }]
      searchIndex.build(unpublishedPosts)
      expect(searchIndex.indexSize).toBe(2)
    })
  })

  describe('search', () => {
    it('应该根据标题匹配结果', () => {
      const results = searchIndex.search('React Hooks')
      expect(results).toHaveLength(1)
      expect(results[0].slug).toBe('react-hooks')
    })

    it('应该根据描述匹配结果', () => {
      const results = searchIndex.search('TypeScript')
      expect(results).toHaveLength(1)
      expect(results[0].slug).toBe('typescript-tips')
    })

    it('应该支持模糊搜索', () => {
      const results = searchIndex.search('react hook')
      expect(results).toHaveLength(1)
    })

    it('空查询应该返回空数组', () => {
      const results = searchIndex.search('')
      expect(results).toEqual([])
    })

    it('应该正确处理大小写', () => {
      const results1 = searchIndex.search('react')
      const results2 = searchIndex.search('REACT')
      expect(results1).toEqual(results2)
    })

    it('应该返回相关性分数', () => {
      const results = searchIndex.search('React Hooks')
      expect(results[0].score).toBeGreaterThan(0)
      expect(results[0].score).toBeLessThanOrEqual(1)
    })

    it('应该按相关性排序', () => {
      const results = searchIndex.search('TypeScript')
      expect(results).toBeSortedBy('score', { descending: true })
    })
  })

  describe('性能测试', () => {
    it('搜索应该在 100ms 内完成', () => {
      const start = performance.now()
      searchIndex.search('React')
      const end = performance.now()
      expect(end - start).toBeLessThan(100)
    })

    it('应该能处理大量文章', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post Title ${i}`,
        description: `Description ${i}`,
        date: '2024-01-01',
        published: true
      }))
      
      searchIndex.build(largeDataset)
      expect(() => searchIndex.search('test')).not.toThrow()
    })
  })
})
```

---

## 🔄 Spec 评审流程

### 评审检查清单

```markdown
## Spec 评审会议

**参与者**:
- [ ] 产品负责人
- [ ] 技术负责人
- [ ] 开发工程师
- [ ] 测试工程师（可选）

**评审要点**:
1. [ ] 需求是否清晰完整？
2. [ ] 技术方案是否可行？
3. [ ] API 设计是否合理？
4. [ ] 数据结构是否满足需求？
5. [ ] 测试用例是否充分？
6. [ ] 性能和安全是否考虑？
7. [ ] 时间评估是否合理？

**输出物**:
- [ ] 确认的 Spec 文档
- [ ] 技术方案文档
- [ ] 测试计划
- [ ] 时间计划
- [ ] 风险清单
```

---

## 📝 Spec 文档模板

```markdown
# [功能名称] Spec

## 概述
- **功能**: 简要描述
- **优先级**: P0/P1/P2
- **负责人**: XXX
- **预计完成**: YYYY-MM-DD

## 需求详情
### 用户故事
作为 [角色]，我想要 [功能]，以便 [价值]

### 功能列表
- [ ] 功能点 1
- [ ] 功能点 2

## 技术方案
### 架构设计
[架构图或说明]

### API 设计
```typescript
// 接口定义
```

### 数据模型
```typescript
// 数据结构
```

## 测试策略
### 单元测试
- 测试点 1
- 测试点 2

### 集成测试
- 测试场景 1
- 测试场景 2

### E2E 测试
- 用户流程 1
- 用户流程 2

## 风险评估
- 风险 1: 描述 + 缓解方案
- 风险 2: 描述 + 缓解方案

## 验收标准
- [ ] 所有测试通过
- [ ] 性能指标达标
- [ ] 文档完成
- [ ] Code Review 通过
```

---

## 🎯 下一步行动

### 立即执行
1. ✅ 保存此规范到项目
2. ✅ 团队学习和确认
3. ✅ 应用到下一个功能开发

### 待办事项
- [ ] 配置测试环境（Vitest + Testing Library）
- [ ] 编写现有代码的测试用例
- [ ] 建立 CI/CD 测试流程
- [ ] 创建测试数据 Mock 工具

---

**版本**: v1.0.0  
**创建日期**: 2024-01-01  
**维护者**: Personal Blog Team
