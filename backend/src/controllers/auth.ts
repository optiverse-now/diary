import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { SignInInput, SignUpInput, signInSchema, signUpSchema } from '../lib/validation';
import { generateToken, hashPassword, comparePasswords } from '../lib/auth';

// Prismaクライアントのインスタンスをグローバルに保持
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const signUp = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = signUpSchema.parse(body) as SignUpInput;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return c.json({ error: 'このメールアドレスは既に登録されています' }, 400);
    }

    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(validatedData.password);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // トークンの生成
    const token = generateToken(user.id);

    return c.json({ user, token });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: '登録に失敗しました' }, 500);
  }
};

export const signIn = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = signInSchema.parse(body) as SignInInput;

    // ユーザーの検索
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return c.json({ error: 'メールアドレスまたはパスワードが間違っています' }, 401);
    }

    // パスワードの検証
    const isValid = await comparePasswords(validatedData.password, user.password);

    if (!isValid) {
      return c.json({ error: 'メールアドレスまたはパスワードが間違っています' }, 401);
    }

    // レスポンスからパスワードを除外
    const { password: _, ...userWithoutPassword } = user;

    // トークンの生成
    const token = generateToken(user.id);

    return c.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'ログインに失敗しました' }, 500);
  }
}; 