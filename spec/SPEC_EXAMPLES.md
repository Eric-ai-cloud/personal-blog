# 💡 Spec 实例库 (Spec Examples)

> **用途**: 提供真实的 Spec 案例，帮助理解如何编写高质量的 Spec  
> **版本**: v1.0.0

---

## 📋 实例目录

1. [文章搜索功能](#实例1-文章搜索功能) - P1 优先级
2. [暗色模式切换](#实例2-暗色模式切换) - P2 优先级
3. [评论系统](#实例3-评论系统) - P1 优先级

---

## 实例 1: 文章搜索功能

### 📋 概述

- **功能描述**: 允许用户通过关键词搜索博客文章，支持标题和内容的模糊搜索
- **优先级**: P1
- **负责人**: 开发团队
- **预计完成日期**: 2024-02-01
- **状态**: ✅ Approved

---

### 1️⃣ 需求分析

#### 功能目标

**问题**: 随着文章数量增加，用户难以快速找到感兴趣的内容

**目标**:
- 提供实时搜索功能
- 支持标题和正文内容搜索
- 搜索结果按相关性排序
- 响应时间 < 100ms

#### 用户场景

**用户故事 1**:
```
作为 博客读者
我想要 在搜索框输入关键词
以便 快速找到相关文章
```

**验收标准**:
- [ ] 搜索框在所有页面可见
- [ ] 输入时实时显示结果
- [ ] 点击结果跳转到文章
- [ ] 支持空搜索（返回所有）

#### 业务价值

- 📈 **用户体验**: 提升内容发现效率
- 🎯 **留存率**: 帮助用户找到感兴趣内容，增加停留时间

#### 优先级评估

| 维度 | 评分 (1-5) | 说明 |
|------|-----------|------|
| 用户需求迫切度 | 4 | 文章增多后需求明显 |
| 业务价值 | 4 | 提升用户体验 |
| 技术可行性 | 5 | 成熟方案多 |
| 开发成本 | 4 | 工作量适中 |
| **总分** | **4.25** | **P1** |

---

### 2️⃣ 技术方案

#### 技术选型

| 技术/库 | 版本 | 选择理由 | 替代方案 |
|---------|------|---------|---------|
| Fuse.js | ^7.0 | 轻量、模糊搜索、性能好 | Lunr.js, FlexSearch |

#### 架构设计

**影响范围**:
- ✅ 新增: SearchBox 组件
- ✅ 新增: search.ts 工具类
- ✅ 修改: Header 组件（添加搜索框）
- ❌ 不影响: 其他现有组件

**组件关系**:
```
Header
  └─ SearchBox
       ├─ SearchInput
       └─ SearchResultDropdown
```

#### 性能考虑

| 指标 | 要求 | 优化策略 |
|------|------|---------|
| 搜索响应时间 | < 100ms | 索引预构建、防抖 |
| 索引大小 | < 1MB | 只索引标题和摘要 |
| 首次加载 | < 500ms | 懒加载搜索库 |

#### 安全考虑

| 风险 | 级别 | 防护措施 |
|------|------|---------|
| XSS（搜索脚本注入） | 中 | 输入转义、内容过滤 |

---

### 3️⃣ API/接口设计

#### 输入参数

```typescript
interface SearchOptions {
  /** 搜索关键词 */
  query: string
  /** 最大结果数 */
  limit?: number
  /** 是否搜索全文 */
  fullText?: boolean
}
```

**验证规则**:
```typescript
function validateOptions(options: SearchOptions): boolean {
  if (!options.query || options.query.trim().length === 0) return false
  if (options.limit && (options.limit < 1 || options.limit > 100)) return false
  return true
}
```

#### 输出结果

```typescript
interface SearchResult {
  /** 文章 slug */
  slug: string
  /** 文章标题 */
  title: string
  /** 高亮片段 */
  excerpt: string
  /** 相关性分数 */
  score: number
  /** 匹配的字段 */
  matchedFields: string[]
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  time: number // 搜索耗时（毫秒）
}
```

#### 错误处理

| 错误类型 | 错误码 | 错误消息 | 处理方式 |
|---------|--------|---------|---------|
| 空查询 | 400 | "Query cannot be empty" | 显示提示 |
| 无结果 | 200 | "No results found" | 显示空状态 |

#### 兼容性

- [x] 不需要向后兼容（新功能）

---

### 4️⃣ 数据结构

#### 数据模型

```typescript
/**
 * 搜索索引文档
 */
interface SearchDocument {
  id: string
  slug: string
  title: string
  description: string
  content?: string // 可选，用于全文搜索
  tags: string[]
  date: string
}

/**
 * 搜索索引
 */
interface SearchIndex {
  documents: SearchDocument[]
  index: any // Fuse.js index
  build(documents: SearchDocument[]): void
  search(query: string, options?: SearchOptions): SearchResult[]
}
```

#### 数据存储

- 存储方式: 客户端内存（运行时构建索引）
- 存储格式: JavaScript 对象
- 索引策略: 启动时一次性构建

#### 边界条件

- 空查询: 返回空数组或所有结果（根据配置）
- 特殊字符: 转义后搜索
- 大小写: 不敏感
- 超长查询: 截断到 200 字符

---

### 5️⃣ 用户体验

#### 交互流程

```
1. 用户点击搜索图标
2. 搜索框展开
3. 用户输入关键词
4. 实时显示匹配结果（最多 10 条）
5. 用户点击结果跳转
6. 或按 ESC 关闭搜索
```

#### UI/UX 设计

- 设计风格: 简约现代
- 关键界面: 
  - 搜索图标（右上角）
  - 搜索输入框（带清除按钮）
  - 结果下拉列表（高亮匹配）
- 交互细节:
  - 输入防抖（300ms）
  - 键盘导航（上下箭头选择，Enter 跳转）
  - 高亮匹配文本

#### 响应式设计

| 断点 | 适配要求 |
|------|---------|
| 移动端 | 全屏搜索界面 |
| 桌面 | 下拉列表，宽度 400px |

#### 无障碍访问

- [x] 键盘导航支持（Tab, Enter, Esc, Arrow keys）
- [x] 屏幕阅读器友好（ARIA labels）
- [x] 焦点管理

---

### 6️⃣ 测试策略

#### 单元测试

```typescript
describe('SearchIndex', () => {
  describe('build', () => {
    it('应该正确构建搜索索引', () => {
      const index = new SearchIndex()
      index.build(mockPosts)
      expect(index.size).toBe(mockPosts.length)
    })

    it('应该只索引已发布的文章', () => {
      const index = new SearchIndex()
      index.build([...mockPosts, unpublishedPost])
      expect(index.size).toBe(mockPosts.length)
    })
  })

  describe('search', () => {
    it('应该根据标题匹配结果', () => {
      const index = new SearchIndex()
      index.build(mockPosts)
      const results = index.search('React')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].title).toContain('React')
    })

    it('应该支持模糊搜索', () => {
      const results = index.search('react hook')
      expect(results).toHaveLength(1)
    })

    it('应该按相关性排序', () => {
      const results = index.search('TypeScript')
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })

    it('应该在 100ms 内完成搜索', () => {
      const start = performance.now()
      index.search('test')
      const end = performance.now()
      expect(end - start).toBeLessThan(100)
    })
  })
})
```

**覆盖目标**: 85%+

#### 组件测试

```typescript
describe('SearchBox', () => {
  it('应该正确渲染搜索框', () => {
    render(<SearchBox />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('输入时应该显示搜索结果', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)
    
    const input = screen.getByPlaceholderText(/search/i)
    await user.type(input, 'React')
    
    await waitFor(() => {
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    })
  })

  it('点击结果应该导航到文章', async () => {
    // 测试导航逻辑
  })

  it('按 ESC 应该关闭搜索框', async () => {
    // 测试关闭行为
  })
})
```

#### 集成测试

```typescript
describe('Search Integration', () => {
  it('应该能从首页进行搜索', async () => {
    render(<HomePage />)
    
    // 打开搜索
    const searchButton = screen.getByLabelText(/open search/i)
    fireEvent.click(searchButton)
    
    // 输入关键词
    const input = screen.getByPlaceholderText(/search/i)
    await userEvent.type(input, 'React')
    
    // 验证结果显示
    await waitFor(() => {
      expect(screen.getByText(/react hooks/i)).toBeInTheDocument()
    })
  })
})
```

#### E2E 测试

```typescript
test.describe('Search E2E', () => {
  test('用户应该能搜索文章', async ({ page }) => {
    await page.goto('/')
    
    // 点击搜索
    await page.click('[aria-label="Open search"]')
    
    // 输入关键词
    await page.fill('input[placeholder*="Search"]', 'React')
    
    // 等待结果
    await page.waitForSelector('.search-result')
    
    // 验证结果
    const results = await page.locator('.search-result').count()
    expect(results).toBeGreaterThan(0)
  })

  test('应该支持键盘导航', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k') // 打开搜索
    await page.keyboard.type('React')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // 验证跳转
    await page.waitForURL('/blog/**')
  })
})
```

---

### 7️⃣ 风险评估

#### 技术风险

| 风险 | 可能性 | 影响 | 缓解方案 |
|------|--------|------|---------|
| 大量文章导致索引慢 | 低 | 中 | 分页索引、Web Worker |
| Fuse.js 包体积大 | 中 | 低 | 动态导入、代码分割 |

#### 时间评估

| 任务 | 预估时间 | 缓冲 | 总计 |
|------|---------|------|------|
| 开发 | 2 天 | 0.5 天 | 2.5 天 |
| 测试 | 1 天 | 0.5 天 | 1.5 天 |
| 文档 | 0.5 天 | 0 | 0.5 天 |
| **总计** | **3.5 天** | **1 天** | **4.5 天** |

#### 回滚方案

```
如果出问题:
1. 隐藏搜索入口（feature flag）
2. 回滚代码
3. 修复后重新发布

数据恢复:
- 无需数据迁移，无风险
```

---

### 8️⃣ 验收标准

- [x] 所有用户故事通过测试
- [x] 搜索响应时间 < 100ms
- [x] 代码覆盖率 > 85%
- [x] ESLint 无警告
- [x] TypeScript 无错误
- [x] 支持键盘导航
- [x] 移动端适配完成

---

### 9️⃣ 评审记录

**评审人员**:
- 产品负责人: ✅ 通过
- 技术负责人: ✅ 通过
- 开发工程师: ✅ 可行
- 测试工程师: ✅ 测试充分

**评审结果**: ✅ **Approved** - 可以开始开发

---

**这个 Spec 已完成评审，可以作为开发参考！**

---

## 实例 2: 暗色模式切换

*(此处为简化示例)*

### 📋 概述

- **功能描述**: 允许用户在亮色和暗色主题之间切换
- **优先级**: P2
- **状态**: ✅ Approved

### 核心要点

**技术方案**:
- 使用 CSS variables + Tailwind dark mode
- 存储用户偏好到 localStorage
- 支持系统级偏好检测

**测试重点**:
- 主题切换功能
- 偏好持久化
- 所有页面的暗色样式

**验收标准**:
- [ ] 所有页面支持暗色模式
- [ ] 切换立即生效
- [ ] 刷新后保持用户选择

---

## 实例 3: 评论系统

*(此处为简化示例)*

### 📋 概述

- **功能描述**: 为每篇文章添加评论功能
- **优先级**: P1
- **状态**: 📝 Draft

### 核心要点

**技术方案**:
- 第三方服务: Giscus (GitHub Discussions)
- 零后端，纯前端集成

**测试重点**:
- 评论加载
- 用户认证
- 评论提交

**验收标准**:
- [ ] GitHub 用户可以评论
- [ ] 支持 Markdown 格式
- [ ] 管理员可以回复和删除

---

## 📖 如何使用这些实例

### 学习 Spec 写法

1. 阅读完整实例 1（文章搜索）
2. 注意七个维度的完整性
3. 关注测试策略的详细程度
4. 学习风险评估方法

### 编写自己的 Spec

1. 复制 [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md)
2. 参考实例的结构和深度
3. 根据实际情况调整详细程度
4. 完成后进行团队评审

### 持续改进

- 项目完成后对比 Spec 和实际实现
- 记录 Spec 中遗漏的点
- 更新模板和实例库

---

**版本**: v1.0.0  
**最后更新**: 2024-01-01
