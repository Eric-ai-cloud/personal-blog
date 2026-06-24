import { vi } from 'vitest'
import React from 'react'

/**
 * 创建 Mock Next.js Router
 */
export function createMockRouter(overrides?: Partial<any>) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    ...overrides,
  }
}

/**
 * 创建 Mock MDX 组件
 */
export function createMockMDXComponent(content: string) {
  return function MockMDXComponent() {
    return React.createElement('div', { 
      dangerouslySetInnerHTML: { __html: content } 
    })
  }
}

/**
 * Mock fetch 函数
 */
export function mockFetch(data: any, options?: { delay?: number; error?: boolean }) {
  return vi.fn().mockImplementation(async () => {
    if (options?.delay) {
      await new Promise(resolve => setTimeout(resolve, options.delay))
    }

    if (options?.error) {
      throw new Error('Mock error')
    }

    return {
      ok: true,
      status: 200,
      json: async () => data,
    }
  })
}

/**
 * 按 URL 和方法匹配的 Mock fetch 函数
 * 支持一个 fetch mock 根据不同的 URL 返回不同数据
 */
export function mockFetchWithMatcher(
  matchers: Array<{
    pattern: RegExp | string
    method?: string
    data: any
    options?: { status?: number; delay?: number; error?: boolean }
  }>
) {
  return vi.fn().mockImplementation(async (url: string | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.url
    const method = (init?.method || 'GET').toUpperCase()

    for (const matcher of matchers) {
      const urlMatch =
        typeof matcher.pattern === 'string'
          ? urlStr.includes(matcher.pattern)
          : matcher.pattern.test(urlStr)
      const methodMatch = !matcher.method || matcher.method.toUpperCase() === method

      if (urlMatch && methodMatch) {
        if (matcher.options?.error) throw new Error('Mock fetch error')
        if (matcher.options?.delay)
          await new Promise((r) => setTimeout(r, matcher.options!.delay))
        return {
          ok: matcher.options?.status ? matcher.options.status < 400 : true,
          status: matcher.options?.status || 200,
          json: async () => matcher.data,
        }
      }
    }
    return { ok: false, status: 404, json: async () => ({ error: 'not found' }) }
  })
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}
