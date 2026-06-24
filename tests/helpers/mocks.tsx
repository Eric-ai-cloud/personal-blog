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
    return <div dangerouslySetInnerHTML={{ __html: content }} />
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
