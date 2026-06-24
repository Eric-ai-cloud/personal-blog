/**
 * 格式化日期
 * 使用 UTC 方法提取日期组件，避免时区偏移问题
 * gray-matter 将 "2026-06-04" 解析为 Date("2026-06-04T00:00:00.000Z")
 * 必须使用 UTC 方法来获取原始日期值
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString)

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`)
  }

  // 使用 UTC 方法，与 gray-matter 解析方式保持一致
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  return `${year}年${month}月${day}日`
}
