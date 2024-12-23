import { vi } from 'vitest'

export const usePathname = vi.fn()
export const useRouter = vi.fn()
export const useSearchParams = vi.fn()
export const useParams = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
})) 