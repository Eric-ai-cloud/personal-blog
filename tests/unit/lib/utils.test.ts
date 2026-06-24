import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('utils.ts 工具函数', () => {
  describe('formatDate', () => {
    it('应该正确格式化标准日期格式', () => {
      const result = formatDate('2024-01-01')
      expect(result).toContain('2024')
      expect(result).toContain('1月')
      expect(result).toContain('1日')
    })

    it('应该正确处理月末日期', () => {
      const result = formatDate('2024-01-31')
      expect(result).toContain('31日')
    })

    it('应该正确处理年末日期', () => {
      const result = formatDate('2024-12-31')
      expect(result).toContain('12月')
      expect(result).toContain('31日')
    })

    it('应该处理无效日期字符串', () => {
      expect(() => formatDate('invalid-date')).toThrow()
    })

    it('应该处理空字符串', () => {
      expect(() => formatDate('')).toThrow()
    })

    it('应该处理ISO格式日期', () => {
      const result = formatDate('2024-06-15T00:00:00Z')
      expect(result).toContain('2024')
    })
  })
})
