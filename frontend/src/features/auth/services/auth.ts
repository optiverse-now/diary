import { type SignUpInput, type SignInInput, type User } from '../types';

type AuthResponse = {
  user: User;
  token: string;
};

export const login = async (input: SignInInput): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:3001/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('メールアドレスまたはパスワードが間違っています');
  }

  return response.json();
};

export const signUp = async (input: SignUpInput): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:3001/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('アカウントの作成に失敗しました');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch('http://localhost:3001/api/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('ログアウトに失敗しました');
  }
}; 