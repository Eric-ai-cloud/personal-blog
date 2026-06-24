# 📋 Spec 与规范文档中心

> **用途**: 集中管理项目的所有行为规范、Spec 讨论框架和测试驱动开发规范  
> **版本**: v1.0.0  
> **最后更新**: 2024-01-01

---

## 📚 文档分类

### 🎯 核心规范（必读）

| 文档 | 说明 | 适用场景 |
|------|------|---------|
| [SPEC_GUIDELINES.md](./SPEC_GUIDELINES.md) | **Spec 编写指南** - 如何编写高质量的 Spec | 所有功能开发前 |
| [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) | **测试规范标准** - 测试编写要求和最佳实践 | 编写测试用例时 |
| [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | **开发规范汇总** - 代码、命名、Git 等规范 | 日常开发参考 |

### 📝 Spec 模板与示例

| 文档 | 说明 | 使用时机 |
|------|------|---------|
| [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md) | **Spec 标准模板** - 可直接使用的 Spec 格式 | 开始写 Spec 时 |
| [SPEC_EXAMPLES.md](./SPEC_EXAMPLES.md) | **Spec 实例库** - 真实的 Spec 案例 | 学习 Spec 写法 |

### 🧪 测试相关

| 文档 | 说明 | 使用时机 |
|------|------|---------|
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | **完整测试指南** - 单元测试、组件测试、E2E | 编写测试时参考 |
| [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) | **测试检查清单** - 提交前确认项 | PR 前自查 |

### 📊 规范体系

| 文档 | 说明 | 使用时机 |
|------|------|---------|
| [STANDARDS_SUMMARY.md](./STANDARDS_SUMMARY.md) | **规范总结** - 所有规范的要点汇总 | 快速查阅规范 |
| [DIAGRAM.md](./DIAGRAM.md) | **规范体系图** - 可视化的规范架构 | 理解规范体系 |

---

## 🎯 核心原则

### 1️⃣ Spec 先行原则

**任何功能开发前必须**:
1. ✅ 编写 Spec 文档
2. ✅ 进行 Spec 评审
3. ✅ 明确测试策略
4. ✅ 评估风险和可行性

**禁止**:
- ❌ 没有 Spec 直接编码
- ❌ 跳过 Spec 评审
- ❌ 忽略测试规划

### 2️⃣ 测试驱动原则

**所有产出必须包含**:
- ✅ 单元测试（80%+ 覆盖率）
- ✅ 组件测试（公共组件 100%）
- ✅ 集成测试（关键路径 100%）
- ✅ E2E 测试（核心流程 100%）

---

## 📖 使用指南

### 场景 1: 我要开发新功能

**阅读顺序**:
1. 📘 [SPEC_GUIDELINES.md](./SPEC_GUIDELINES.md) - 了解如何写 Spec
2. 📘 [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md) - 使用模板编写 Spec
3. 📘 [SPEC_EXAMPLES.md](./SPEC_EXAMPLES.md) - 参考实际案例
4. 📘 [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) - 了解测试要求
5. 📘 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 学习测试编写方法

**预计时间**: 60-90 分钟（Spec 编写 + 测试规划）

### 场景 2: 我要开始写代码

**必读文档**:
- 📘 [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) - 代码规范
- 📘 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 测试指南
- 📘 [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) - 提交前检查

### 场景 3: 我要编写测试

**参考文档**:
- 📘 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 完整测试指南
- 📘 [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) - 测试规范要求
- 📘 [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) - 检查清单

### 场景 4: 我要进行 Code Review

**审查要点**:
- 📘 [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) - 代码规范
- 📘 [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) - 测试覆盖
- 📘 [TEST_CHECKLIST.md](./TEST_CHECKLIST.md) - 质量检查

### 场景 5: 我忘记了某个规范

**快速查询**:
- 📘 [STANDARDS_SUMMARY.md](./STANDARDS_SUMMARY.md) - 规范要点汇总
- 📘 [CHEATSHEET.md](../CHEATSHEET.md) - 速查卡片

---

## 🔗 与其他文档的关系

### Spec 文件夹 vs 根目录文档

```
spec/                          # 规范和 Spec 相关文档
├── SPEC_*.md                  # Spec 编写指南和模板
├── TESTING_*.md               # 测试规范 and 指南
├── DEVELOPMENT_STANDARDS.md   # 开发规范汇总
└── DIAGRAM.md                 # 规范体系图

根目录/                        # 项目主文档
├── README.md                  # 项目介绍
├── QUICKSTART.md              # 快速上手
├── CONTRIBUTING.md            # 贡献指南
├── STRUCTURE.md               # 项目结构
└── CHEATSHEET.md              # 速查卡片
```

**区别**:
- `spec/` - 专注于**如何开发**（规范、流程、标准）
- 根目录 - 专注于**项目本身**（介绍、结构、使用）

---

## 📊 文档统计

```
Spec 文档总数: 9 个
总行数: ~3,500+ 行
总字数: ~70,000+ 字

分类:
- Spec 相关: 3 个
- 测试相关: 3 个
- 规范相关: 3 个
```

---

## 🔄 维护与更新

### 更新原则

1. **规范变更**: 必须经过团队讨论和确认
2. **模板修改**: 需要同步更新相关示例
3. **文档同步**: Spec 文档与实际开发保持一致
4. **版本管理**: 重大变更需要更新版本号

### 更新流程

```
提出修改建议
    ↓
团队讨论
    ↓
更新文档
    ↓
通知团队
    ↓
培训新规范（如需要）
```

---

## 💡 最佳实践

### Spec 编写

- ✅ 使用标准模板
- ✅ 包含详细的测试策略
- ✅ 明确边界情况
- ✅ 评估风险和可行性
- ✅ 进行 Spec 评审

### 测试编写

- ✅ 先写测试，再写实现（TDD）
- ✅ 遵循 AAA 模式（Arrange-Act-Assert）
- ✅ 有意义的测试名称
- ✅ 独立的测试用例
- ✅ 充分的断言

### 规范遵循

- ✅ 定期回顾规范
- ✅ 新项目严格执行规范
- ✅ 发现规范问题及时反馈
- ✅ 持续改进规范

---

## 📞 获取帮助

### 遇到问题？

1. 📖 查阅相关文档
2. 🔍 搜索关键词
3. 💬 团队讨论
4. 📝 记录问题和解决方案

### 改进建议

欢迎提出改进建议：
- 创建 Issue
- 提交 PR
- 团队会议讨论

---

## ✨ 文档亮点

✅ **结构化**: 清晰的分类和层级  
✅ **实用性**: 大量模板和示例  
✅ **可维护**: Markdown 格式，易于更新  
✅ **可视化**: 图表和表格辅助理解  
✅ **完整性**: 覆盖 Spec 到测试的全流程  

---

**建议**: 将此页面加入书签，作为规范文档的中心入口！

**版本**: v1.0.0  
**创建日期**: 2024-01-01  
**维护者**: Personal Blog Team
