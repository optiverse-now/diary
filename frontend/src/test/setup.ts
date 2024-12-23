import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import './mocks/next-navigation'

expect.extend(matchers as any)

// グローバルなモックの設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Next.jsのモック
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useParams: vi.fn(() => ({})),
}));

// グローバル変数の設定
vi.stubGlobal('process', {
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3000',
  },
});

// 認証関連のモック
vi.mock('@/shared/utils/storage', () => ({
  getToken: vi.fn(() => 'dummy-token'),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
}) 