'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface SearchBarProps {
  /** 当前搜索关键词 */
  searchQuery: string
  /** 搜索词变化回调 */
  onSearchChange: (query: string) => void
}

/**
 * 文章搜索栏组件
 * 支持按标题、描述和标签搜索文章
 */
export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // 同步外部 searchQuery 变化
  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  // 防抖处理：输入停止 300ms 后才触发搜索
  const handleChange = useCallback(
    (value: string) => {
      setLocalValue(value)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        onSearchChange(value.trim())
      }, 300)
    },
    [onSearchChange]
  )

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // 清空搜索
  const handleClear = useCallback(() => {
    setLocalValue('')
    onSearchChange('')
    inputRef.current?.focus()
  }, [onSearchChange])

  // 键盘快捷键：Ctrl+K / Cmd+K 聚焦搜索框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // ESC 清空搜索
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClear])

  return (
    <div className="mb-6">
      <label
        htmlFor="search-input"
        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        搜索文章
      </label>
      <div className="relative">
        {/* 搜索图标 */}
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* 输入框 */}
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="搜索文章标题、描述或标签..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-20 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
          aria-label="搜索文章"
          autoComplete="off"
        />

        {/* 右侧操作区 */}
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {/* 清空按钮 */}
          {localValue && (
            <button
              onClick={handleClear}
              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="清空搜索"
              title="清空搜索"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* 快捷键提示 */}
          <kbd className="hidden rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700 sm:inline-block">
            {localValue ? 'ESC' : 'Ctrl+K'}
          </kbd>
        </div>
      </div>
    </div>
  )
}
