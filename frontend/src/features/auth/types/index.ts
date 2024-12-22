import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'パスワードは8文字以上で入力してください' })
  .max(100, { message: 'パスワードは100文字以下で入力してください' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'パスワードは大文字、小文字、数字を含める必要があります',
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '正しいメールアドレスを入力してください' }),
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名前を入力してください' })
    .max(50, { message: '名前は50文字以下で入力してください' }),
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '正しいメールアドレスを入力してください' }),
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type AuthError = {
  error: string;
}; 