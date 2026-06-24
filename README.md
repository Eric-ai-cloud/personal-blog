# 个人博客项目 (Personal Blog)

基于 Next.js 14 + TypeScript + Tailwind CSS 构建的现代化个人博客系统。

## 📚 文档导航

**完整索引**:
- 📚 [DOCS_INDEX.md](./DOCS_INDEX.md) - **完整文档索引（所有文档总目录）**

**快速开始系列**:
- 📘 [OVERVIEW.md](./OVERVIEW.md) - **项目规范概览（必读）**
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - 5分钟快速上手
- 📖 [README.md](./README.md) - 项目介绍（本文档）
- ⚡ [CHEATSHEET.md](./CHEATSHEET.md) - 快速参考卡片

**开发规范系列**:
- 📝 [DEVELOPMENT.md](./DEVELOPMENT.md) - 详细开发规范
- 📊 [STANDARDS.md](./STANDARDS.md) - 规范总结清单
- 🏗️ [STRUCTURE.md](./STRUCTURE.md) - 项目结构详解
- 🎨 [DIAGRAM.md](./DIAGRAM.md) - 规范体系图表

**贡献与报告**:
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - 如何参与贡献
- 📋 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目完成报告

---

## 🚀 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **内容**: MDX (Markdown + JSX)
- **部署**: [Vercel](https://vercel.com/)

## 📁 项目结构

```
personal-blog/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── blog/         # 博客列表页
│   │   └── about/        # 关于页面
│   ├── components/       # React 组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BlogCard.tsx
│   │   └── Layout.tsx
│   ├── lib/             # 工具函数和配置
│   │   ├── mdx.ts       # MDX 处理
│   │   └── utils.ts     # 通用工具
│   ├── styles/          # 全局样式
│   │   └── globals.css
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   └── content/         # MDX 博客文章
│       └── posts/
├── public/              # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🛠️ 开发环境搭建

### 前置要求

- Node.js 18+ 
- npm 或 pnpm

### 安装步骤

```bash
# 克隆项目
git clone <your-repo-url>
cd personal-blog

# 安装依赖
npm install
# 或
pnpm install

# 运行测试（确保测试通过）
npm test

# 启动开发服务器
npm run dev
# 或
pnpm dev
```

访问 http://localhost:3000 查看效果。

---

## 🧪 测试驱动开发

本项目遵循**测试驱动开发（TDD）**原则，所有代码都必须包含对应的测试用例。

### 测试命令

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

### 测试结构

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

### 测试覆盖要求

- ✅ **单元测试**: 80%+ 覆盖率
- ✅ **组件测试**: 所有公共组件
- ✅ **集成测试**: 关键数据流
- ✅ **E2E测试**: 核心用户流程

详细测试指南请参考：[TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 📝 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式风格和 Hooks
- 所有组件必须有明确的类型定义

### 命名规范

- 组件文件: `PascalCase.tsx`
- 工具函数: `camelCase.ts`
- 样式类: 使用 Tailwind 实用类
- 类型定义: `PascalCase`

### Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具链
```

示例:
```bash
git commit -m "feat: 添加博客文章列表页面"
git commit -m "fix: 修复导航栏响应式问题"
```

## 🎯 核心功能

- ✅ 响应式设计，支持移动端
- ✅ MDX 支持，可在文章中嵌入 React 组件
- ✅ SEO 优化
- ✅ 语法高亮的代码块
- ✅ 暗色/亮色主题切换（可选）
- ✅ RSS Feed（可选）

## 📖 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 📄 许可证

MIT License

---

**开始编码前请阅读:**
1. 本 README 了解项目结构
2. 开发规范章节保持一致性
3. 遇到问题先查阅相关文档
