import { useState } from 'react'
import Input from '../ui/input'
import Button from '../ui/button'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(mode === 'login' ? 
        { email: formData.email, password: formData.password } :
        { email: formData.email, password: formData.password, name: formData.name }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      {error && (
        <div className="text-error text-sm">{error}</div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '新規登録'}
      </Button>
    </form>
  )
} 