import { vi } from 'vitest';
import { AuthResponse, LoginInput, SignUpInput } from '../auth';

export const login = vi.fn(async (input: LoginInput): Promise<AuthResponse> => {
  return {
    token: 'mock-token',
    user: {
      id: '1',
      email: input.email,
    },
  };
});

export const signUp = vi.fn(async (input: SignUpInput): Promise<AuthResponse> => {
  return {
    token: 'mock-token',
    user: {
      id: '1',
      email: input.email,
    },
  };
});

export const logout = vi.fn(async (): Promise<void> => {
  return;
}); 