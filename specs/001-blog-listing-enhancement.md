# 📝 Spec: 博客文章列表页面优化

> **优先级**: P0  
> **负责人**: 开发团队  
> **预计完成日期**: 2024-01-15  
> **状态**: Draft - 待评审

---

## 1️⃣ 需求分析

### 功能目标

**我们要解决什么问题？**

当前博客列表页面（`src/app/blog/page.tsx`）功能较为基础，需要增强用户体验和功能完整性。

**这个功能要实现什么？**

1. ✅ 展示所有已发布的博客文章列表
2. ✅ 支持按标签筛选文章
3. ✅ 支持按日期排序（最新/最旧）
4. ✅ 显示文章元信息（标题、描述、日期、标签、阅读时间）
5. ✅ 响应式设计，移动端友好
6. ✅ 支持分页或无限滚动（每页 10 篇文章）

### 用户场景

#### 用户故事 1: 浏览文章列表
```
作为 博客读者
我想要 查看所有文章的列表和摘要
以便 快速找到感兴趣的内容
```

**验收标准**:
- [ ] 文章按日期倒序排列（最新的在前）
- [ ] 每篇文章显示标题、描述、日期、标签
- [ ] 点击文章卡片跳转到详情页
- [ ] 移动端布局正确

#### 用户故事 2: 按标签筛选
```
作为 对特定主题感兴趣的读者
我想要 通过标签筛选文章
以便 只看我感兴趣的内容
```

**验收标准**:
- [ ] 显示所有可用标签列表
- [ ] 点击标签后只显示相关文章
- [ ] 可以清除筛选条件
- [ ] 显示当前筛选状态下的文章数量

#### 用户故事 3: 排序切换
```
作为 用户
我想要 切换排序方式（最新/最旧）
以便 按时间顺序浏览文章
```

**验收标准**:
- [ ] 提供排序选项（最新优先/最旧优先）
- [ ] 切换后立即更新列表
- [ ] 保持当前的筛选条件

### 业务价值

- 📈 **用户体验**: 提升内容发现效率
- 🎯 **留存率**: 帮助用户找到感兴趣内容
- 💡 **专业性**: 展示博客的专业形象

### 优先级评估

| 维度 | 评分 (1-5) | 说明 |
|------|-----------|------|
| 用户需求迫切度 | 5 | 核心功能，必需 |
| 业务价值 | 5 | 直接影响用户体验 |
| 技术可行性 | 5 | 成熟方案多 |
| 开发成本 | 4 | 工作量适中 |
| **总分** | **4.75** | **P0** |

---

## 2️⃣ 技术方案

### 技术选型

| 技术/库 | 版本 | 选择理由 | 替代方案 |
|---------|------|---------|---------|
| React Hooks | Built-in | 状态管理 | Redux (过度设计) |
| Tailwind CSS | Built-in | 样式和响应式 | CSS Modules |
| next/link | Built-in | 客户端导航 | window.location |
| date-fns | ^3.0 (可选) | 日期格式化 | 原生 Date |

### 架构设计

**影响范围**:
- ✅ 修改: `src/app/blog/page.tsx` - 主要实现
- ✅ 新增: `src/components/BlogCard.tsx` - 文章卡片组件
- ✅ 新增: `src/components/TagFilter.tsx` - 标签筛选组件
- ✅ 新增: `src/components/SortSelector.tsx` - 排序选择器
- ❌ 不影响: 其他现有组件和 API

**组件关系**:
```
BlogPage (src/app/blog/page.tsx)
├─ TagFilter (标签筛选)
├─ SortSelector (排序选择)
└─ BlogCard[] (文章列表)
   └─ BlogCard (单个文章卡片)
```

### 性能考虑

| 指标 | 要求 | 优化策略 |
|------|------|---------|
| 首屏渲染时间 | < 1s | SSG + ISR |
| 交互响应时间 | < 100ms | 客户端状态管理 |
| 图片加载 | 懒加载 | Next.js Image |
| 列表长度 | 无限制 | 分页或虚拟滚动 |

### 安全考虑

| 风险 | 级别 | 防护措施 |
|------|------|---------|
| XSS（MDX注入） | 中 | MDX 自动转义 |
| 敏感数据泄露 | 低 | 只暴露公开字段 |

---

## 3️⃣ API/接口设计

### 输入参数

**BlogPage 组件 Props**:
```typescript
interface BlogPageProps {
  searchParams?: {
    tag?: string      // 筛选标签
    sort?: 'newest' | 'oldest'  // 排序方式
    page?: number     // 页码
  }
}
```

### 输出结果

**使用现有的 posts.ts 工具函数**:
```typescript
// src/lib/posts.ts 已有的函数
getAllPosts(): BlogPost[]           // 获取所有文章
getPostBySlug(slug: string): PostWithContent | null  // 获取单篇
getSortedPosts(): BlogPost[]        // 获取排序后的文章
getTags(): string[]                 // 获取所有标签
getPostsByTag(tag: string): BlogPost[]  // 按标签获取文章
```

### 数据结构

**BlogPost 类型** (已在 `src/types/index.ts` 定义):
```typescript
interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  published?: boolean
  readingTime?: number  // 阅读时间（分钟）
}
```

---

## 4️⃣ 数据结构

### 数据模型

无需修改数据模型，使用现有的 `BlogPost` 类型。

### 数据存储

- 来源: Markdown 文件 (`src/content/posts/*.mdx`)
- 读取方式: 服务端文件系统 (SSG)
- 缓存策略: Next.js ISR (增量静态生成)

### 边界条件

- 空列表: 显示"暂无文章"提示
- 无匹配标签: 显示"没有找到相关文章"
- 无效页码: 重定向到第一页
- 超长标题/描述: 截断并显示省略号

---

## 5️⃣ 用户体验

### 交互流程

```
1. 用户访问 /blog
2. 显示文章列表（默认最新优先）
3. 用户可以：
   - 点击标签筛选
   - 切换排序方式
   - 翻页浏览
   - 点击文章查看详情
```

### UI/UX 设计

**关键界面元素**:
1. **页面头部**: 标题 + 文章数量统计
2. **筛选区**: 标签云/标签列表
3. **排序控制**: 下拉选择或按钮组
4. **文章列表**: 卡片式布局
5. **分页控件**: 上一页/下一页

**响应式设计**:
- 桌面端: 网格布局（2-3列）
- 平板: 2列
- 移动端: 单列

### 无障碍访问

- [x] 键盘导航支持
- [x] ARIA labels
- [x] 焦点管理
- [x] 颜色对比度符合 WCAG 2.1 AA

---

## 6️⃣ 测试策略

### 单元测试

**测试文件**: `tests/unit/lib/posts.test.ts`

```typescript
describe('posts.ts 工具函数', () => {
  describe('getAllPosts', () => {
    it('应该只返回已发布的文章', () => {
      const posts = getAllPosts()
      posts.forEach(post => {
        expect(post.published).toBe(true)
      })
    })

    it('应该按日期倒序排列', () => {
      const posts = getAllPosts()
      for (let i = 1; i < posts.length; i++) {
        expect(new Date(posts[i-1].date).getTime())
          .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
      }
    })
  })

  describe('getTags', () => {
    it('应该返回所有唯一标签', () => {
      const tags = getTags()
      const uniqueTags = new Set(tags)
      expect(tags.length).toBe(uniqueTags.size)
    })
  })

  describe('getPostsByTag', () => {
    it('应该返回包含指定标签的文章', () => {
      const posts = getPostsByTag('react')
      posts.forEach(post => {
        expect(post.tags).toContain('react')
      })
    })

    it('标签不存在时应该返回空数组', () => {
      const posts = getPostsByTag('non-existent-tag')
      expect(posts).toHaveLength(0)
    })
  })
})
```

**覆盖目标**: 90%+

### 组件测试

**测试文件**: `tests/components/BlogCard.test.tsx`

```typescript
describe('BlogCard Component', () => {
  const mockProps = {
    post: {
      slug: 'test-post',
      title: 'Test Post',
      description: 'This is a test description',
      date: '2024-01-01',
      tags: ['react', 'typescript'],
      readingTime: 5
    }
  }

  it('应该正确渲染文章卡片', () => {
    render(<BlogCard {...mockProps} />)
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#typescript')).toBeInTheDocument()
  })

  it('点击标题应该导航到文章详情', async () => {
    const user = userEvent.setup()
    render(<BlogCard {...mockProps} />)
    
    const link = screen.getByRole('link', { name: /test post/i })
    await user.click(link)
    
    // 验证导航
  })

  it('应该显示阅读时间', () => {
    render(<BlogCard {...mockProps} />)
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument()
  })

  it('应该处理没有标签的情况', () => {
    const propsWithoutTags = {
      ...mockProps,
      post: { ...mockProps.post, tags: undefined }
    }
    render(<BlogCard {...propsWithoutTags} />)
    
    expect(screen.queryByText(/#\w+/)).not.toBeInTheDocument()
  })
})
```

**测试文件**: `tests/components/TagFilter.test.tsx`

```typescript
describe('TagFilter Component', () => {
  const mockTags = ['react', 'typescript', 'nextjs']
  const mockOnTagChange = vi.fn()

  it('应该渲染所有标签', () => {
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
  })

  it('点击标签应该触发回调', async () => {
    const user = userEvent.setup()
    render(<TagFilter tags={mockTags} onTagChange={mockOnTagChange} />)
    
    await user.click(screen.getByText('react'))
    
    expect(mockOnTagChange).toHaveBeenCalledWith('react')
  })

  it('应该高亮选中的标签', () => {
    render(<TagFilter tags={mockTags} selectedTag="react" onTagChange={mockOnTagChange} />)
    
    const selectedTag = screen.getByText('react')
    expect(selectedTag).toHaveClass('bg-blue-500')
  })
})
```

### 集成测试

**测试文件**: `tests/integration/blog-listing.test.tsx`

```typescript
describe('Blog Listing Integration', () => {
  it('应该能加载博客列表页', async () => {
    render(<BlogPage />)
    
    await waitFor(() => {
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    })
  })

  it('应该能按标签筛选', async () => {
    const user = userEvent.setup()
    render(<BlogPage />)
    
    // 点击标签
    const tagButton = screen.getByText('react')
    await user.click(tagButton)
    
    // 验证只显示相关文章
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      articles.forEach(article => {
        expect(article).toHaveTextContent(/react/i)
      })
    })
  })

  it('应该能切换排序', async () => {
    const user = userEvent.setup()
    render(<BlogPage />)
    
    // 切换排序
    const sortSelect = screen.getByLabelText(/sort by/i)
    await user.selectOptions(sortSelect, 'oldest')
    
    // 验证顺序改变
    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      // 验证日期顺序
    })
  })
})
```

### E2E 测试

**测试文件**: `tests/e2e/blog-listing.spec.ts`

```typescript
test.describe('Blog Listing E2E', () => {
  test('用户应该能浏览文章列表', async ({ page }) => {
    await page.goto('/blog')
    
    // 验证文章列表可见
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('用户应该能按标签筛选', async ({ page }) => {
    await page.goto('/blog')
    
    // 点击标签
    await page.click('text=react')
    
    // 等待过滤完成
    await page.waitForSelector('.filtered')
    
    // 验证结果
    const articles = await page.locator('article').count()
    expect(articles).toBeGreaterThan(0)
  })

  test('应该支持响应式布局', async ({ page }) => {
    await page.goto('/blog')
    
    // 移动端视图
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('article').first()).toBeVisible()
    
    // 桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('article').first()).toBeVisible()
  })
})
```

---

## 7️⃣ 风险评估

### 技术风险

| 风险 | 可能性 | 影响 | 缓解方案 |
|------|--------|------|---------|
| 大量文章导致加载慢 | 低 | 中 | 分页/虚拟滚动 |
| 标签过多显示问题 | 中 | 低 | 标签折叠/滚动 |
| 性能问题 | 低 | 中 | SSG + ISR |

### 时间评估

| 任务 | 预估时间 | 缓冲 | 总计 |
|------|---------|------|------|
| 组件开发 | 1.5 天 | 0.5 天 | 2 天 |
| 测试编写 | 1 天 | 0.5 天 | 1.5 天 |
| 文档 | 0.5 天 | 0 | 0.5 天 |
| Code Review | 0.5 天 | 0 | 0.5 天 |
| **总计** | **3.5 天** | **1 天** | **4.5 天** |

### 回滚方案

如果出问题：
1. 恢复到之前的简单列表页面
2. 或使用 feature flag 隐藏新功能
3. 修复后重新发布

---

## 8️⃣ 验收标准

### 功能验收

- [ ] 文章列表正确显示
- [ ] 标签筛选功能正常
- [ ] 排序切换功能正常
- [ ] 分页功能正常（如实现）
- [ ] 响应式布局正确
- [ ] 移动端适配良好

### 质量验收

- [ ] 代码覆盖率 > 85%
- [ ] ESLint 无警告
- [ ] TypeScript 无错误
- [ ] 所有测试通过
- [ ] Lighthouse Performance > 90

### 测试验收

- [ ] 单元测试覆盖率 > 90%
- [ ] 组件测试覆盖所有公共组件
- [ ] 集成测试关键路径 100%
- [ ] E2E 测试核心流程 100%

---

## 9️⃣ 实施计划

### Phase 1: 基础组件 (Day 1-2)
1. 创建 `BlogCard` 组件
2. 创建 `TagFilter` 组件
3. 创建 `SortSelector` 组件
4. 编写组件测试

### Phase 2: 页面集成 (Day 3)
1. 更新 `blog/page.tsx`
2. 集成所有组件
3. 实现筛选和排序逻辑
4. 编写集成测试

### Phase 3: 优化和测试 (Day 4)
1. 性能优化
2. 完善测试用例
3. 文档更新
4. Code Review

### Phase 4: 部署 (Day 5)
1. 合并到 develop 分支
2. CI/CD 自动化测试
3. 部署到生产环境

---

## 🔟 评审记录

### 待评审项

- [ ] 功能需求是否完整
- [ ] 技术方案是否合理
- [ ] 测试策略是否充分
- [ ] 时间评估是否合理
- [ ] 是否有遗漏的边界情况

### 评审人员

| 角色 | 姓名 | 日期 | 意见 |
|------|------|------|------|
| 产品负责人 | | | |
| 技术负责人 | | | |
| 开发工程师 | | | |
| 测试工程师 | | | |

---

**下一步**: 
1. 等待团队评审和批准
2. 根据反馈调整
3. 获得批准后开始开发和测试

**版本**: v1.0.0  
**创建日期**: 2024-01-01  
**状态**: 📝 Draft - 待评审
