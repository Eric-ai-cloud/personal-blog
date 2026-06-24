// 测试渲染辅助函数
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import React from 'react'

// 自定义包装器（如需要Provider等）
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// 自定义render函数
export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, {
    wrapper: TestWrapper,
    ...options,
  })
}

// 带自定义选项的render
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, {
    wrapper: TestWrapper,
    ...options,
  })
}
