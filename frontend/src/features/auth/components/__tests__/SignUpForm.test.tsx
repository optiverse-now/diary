import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignUpForm } from '../SignUpForm'
import { AuthContext } from '@/features/auth/contexts/AuthContext'
import { vi } from 'vitest'

// Next.jsのルーターをモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// toastをモック
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('SignUpForm', () => {
  const mockSignUp = vi.fn()
  const mockSetAuth = vi.fn()
  const mockClearAuth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    render(
      <AuthContext.Provider value={{
        signUp: mockSignUp,
        user: null,
        token: null,
        setAuth: mockSetAuth,
        clearAuth: mockClearAuth,
      }}>
        <SignUpForm />
      </AuthContext.Provider>
    )
  })

  it('フォームが正しくレンダリングされる', () => {
    expect(screen.getByLabelText('名前')).toBeInTheDocument()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新規登録' })).toBeInTheDocument()
  })

  it('必須フィールドが空の場合にエラーを表示する', async () => {
    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages).toHaveLength(3)
      expect(errorMessages[0]).toHaveTextContent('名前を入力してください')
      expect(errorMessages[1]).toHaveTextContent('メールアドレスを入力してください')
      expect(errorMessages[2]).toHaveTextContent('パスワードは8文字以上で入力してください')
    })
  })

  it('無効なメールアドレスの場合にエラーを表示する', async () => {
    const nameInput = screen.getByLabelText('名前')
    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    // 有効な値を入力
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })

    // 無効なメールアドレスを入力
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    // バリデーションエラーが表示されるまで待機
    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages).toHaveLength(1)
      expect(errorMessages[0]).toHaveTextContent('正しいメールアドレスを入力してください')
    })
  })

  it('パスワードが短すぎる場合にエラーを表示する', async () => {
    const nameInput = screen.getByLabelText('名前')
    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    // 有効な値を入力
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    // 無効なパスワードを入力
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages).toHaveLength(1)
      expect(errorMessages[0]).toHaveTextContent('パスワードは8文字以上で入力してください')
    })
  })

  it('既存のメールアドレスでサインアップを試みるとエラーを表示する', async () => {
    const nameInput = screen.getByLabelText('名前')
    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })

    mockSignUp.mockRejectedValueOnce(new Error('既に登録されているメールアドレスです'))

    const submitButton = screen.getByRole('button', { name: '新規登録' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages).toHaveLength(1)
      expect(errorMessages[0]).toHaveTextContent('既に登録されているメールアドレスです')
    })
  })
}) 