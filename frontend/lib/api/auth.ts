interface LoginData {
  email: string
  password: string
}

interface SignupData extends LoginData {
  name: string
}

interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'ログインに失敗しました')
  }

  return response.json()
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '新規登録に失敗しました')
  }

  return response.json()
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'ログアウトに失敗しました')
  }
} 