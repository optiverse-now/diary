import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'
import { signUp, signIn } from '../auth'
import { hashPassword } from '../../lib/auth'

const prisma = new PrismaClient()

type AuthResponse = {
  data: {
    user?: {
      id: string
      name: string
      email: string
    }
    token?: string
    error?: string
  }
  status?: number
}

describe('Auth Controller', () => {
  beforeEach(async () => {
    // テストデータベースのクリーンアップ
    await prisma.user.deleteMany()
  })

  afterEach(async () => {
    // テストデータベースのクリーンアップ
    await prisma.user.deleteMany()
  })

  describe('signUp', () => {
    it('新規ユーザーを正常に登録できる', async () => {
      const mockContext = {
        req: {
          json: () => Promise.resolve({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!'
          })
        },
        json: (data: any, status?: number) => ({ data, status })
      } as unknown as Context

      const response = await signUp(mockContext) as AuthResponse
      expect(response.data.user).toBeDefined()
      expect(response.data.user?.email).toBe('test@example.com')
      expect(response.data.token).toBeDefined()
    })

    it('既存のメールアドレスで登録を試みるとエラーになる', async () => {
      // 既存ユーザーを作成
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'test@example.com',
          password: await hashPassword('Password123!')
        }
      })

      const mockContext = {
        req: {
          json: () => Promise.resolve({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!'
          })
        },
        json: (data: any, status?: number) => ({ data, status })
      } as unknown as Context

      const response = await signUp(mockContext) as AuthResponse
      expect(response.status).toBe(400)
      expect(response.data.error).toBe('このメールアドレスは既に登録されています')
    })
  })

  describe('signIn', () => {
    it('正しい認証情報でログインできる', async () => {
      // テストユーザーを作成
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: await hashPassword('Password123!')
        }
      })

      const mockContext = {
        req: {
          json: () => Promise.resolve({
            email: 'test@example.com',
            password: 'Password123!'
          })
        },
        json: (data: any, status?: number) => ({ data, status })
      } as unknown as Context

      const response = await signIn(mockContext) as AuthResponse
      expect(response.data.user).toBeDefined()
      expect(response.data.user?.email).toBe('test@example.com')
      expect(response.data.token).toBeDefined()
    })

    it('誤った認証情報でログインを試みるとエラーになる', async () => {
      const mockContext = {
        req: {
          json: () => Promise.resolve({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
        },
        json: (data: any, status?: number) => ({ data, status })
      } as unknown as Context

      const response = await signIn(mockContext) as AuthResponse
      expect(response.status).toBe(401)
      expect(response.data.error).toBe('メールアドレスまたはパスワードが間違っています')
    })
  })
}) 