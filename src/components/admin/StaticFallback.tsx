'use client'

import { getVercelAdminUrl } from '@/lib/static-mode'

interface StaticFallbackProps {
  /** 对应的Vercel路径，如 /admin/comments */
  adminPath?: string
  /** 自定义标题 */
  title?: string
  /** 自定义描述 */
  description?: string
}

/**
 * 静态部署模式下的回退页面
 * 引导用户前往 Vercel 管理后台
 */
export default function StaticFallback({
  adminPath = '/admin',
  title = '管理后台',
  description = '当前为静态部署模式，管理功能不可用。请访问 Vercel 部署进行内容管理。',
}: StaticFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        <a
          href={getVercelAdminUrl(adminPath)}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          前往 Vercel 管理后台 →
        </a>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          ↑ 管理后台部署在 Vercel，仅供管理员访问
        </p>
      </div>
    </div>
  )
}
