import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスは必須です" })
    .email({ message: "メールアドレスの形式が正しくありません" }),
  password: z
    .string()
    .min(1, { message: "パスワードは必須です" })
    .min(8, { message: "パスワードは8文字以上である必要があります" }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "名前は必須です" }),
    email: z
      .string()
      .min(1, { message: "メールアドレスは必須です" })
      .email({ message: "メールアドレスの形式が正しくありません" }),
    password: z
      .string()
      .min(1, { message: "パスワードは必須です" })
      .min(8, { message: "パスワードは8文字以上である必要があります" }),
    confirmPassword: z
      .string()
      .min(1, { message: "パスワード（確認）は必須です" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  }); 