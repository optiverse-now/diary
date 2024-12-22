import { PrismaClient } from '@prisma/client'
import { beforeAll, afterAll } from 'vitest'

const prisma = new PrismaClient()

beforeAll(async () => {
  // テストデータベースの準備
  await prisma.$connect()
})

afterAll(async () => {
  // テストデータベースのクリーンアップ
  await prisma.user.deleteMany()
  await prisma.$disconnect()
}) 