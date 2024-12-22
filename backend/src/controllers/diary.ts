import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 日記一覧取得
export const getDiaries = async (c: Context) => {
  const userId = c.get('userId')
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 9
  const skip = (page - 1) * limit

  try {
    const [diaries, total] = await Promise.all([
      prisma.diary.findMany({
        where: {
          userId: userId,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          mood: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.diary.count({
        where: {
          userId: userId,
        },
      }),
    ])

    return c.json({
      diaries,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error('Failed to fetch diaries:', error)
    return c.json({ error: '日記の取得に失敗しました' }, 500)
  }
}

// 日記作成
export const createDiary = async (c: Context) => {
  const userId = c.get('userId')
  try {
    const body = await c.req.json()
    const diary = await prisma.diary.create({
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood,
        tags: body.tags,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return c.json(diary, 201)
  } catch (error) {
    console.error('Failed to create diary:', error)
    return c.json({ error: '日記の作成に失敗しました' }, 500)
  }
}

// 日記詳細取得
export const getDiary = async (c: Context) => {
  const userId = c.get('userId')
  try {
    const id = c.req.param('id')
    const diary = await prisma.diary.findFirst({
      where: { 
        id: id,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!diary) {
      return c.json({ error: '日記が見つかりません' }, 404)
    }
    return c.json(diary)
  } catch (error) {
    console.error('Failed to fetch diary:', error)
    return c.json({ error: '日記の取得に失敗しました' }, 500)
  }
}

// 日記更新
export const updateDiary = async (c: Context) => {
  const userId = c.get('userId')
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    // 更新対象の日記が存在し、ユーザーのものであることを確認
    const existingDiary = await prisma.diary.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!existingDiary) {
      return c.json({ error: '日記が見つかりません' }, 404)
    }

    const diary = await prisma.diary.update({
      where: { id: id },
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood,
        tags: body.tags,
      },
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return c.json(diary)
  } catch (error) {
    console.error('Failed to update diary:', error)
    return c.json({ error: '日記の更新に失敗しました' }, 500)
  }
}

// 日記削除
export const deleteDiary = async (c: Context) => {
  const userId = c.get('userId')
  try {
    const id = c.req.param('id')
    
    // 削除対象の日記が存在し、ユーザーのものであることを確認
    const existingDiary = await prisma.diary.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!existingDiary) {
      return c.json({ error: '日記が見つかりません' }, 404)
    }

    await prisma.diary.delete({
      where: { id: id },
    })
    
    return c.json({ message: '日記を削除しました' })
  } catch (error) {
    console.error('Failed to delete diary:', error)
    return c.json({ error: '日記の削除に失敗しました' }, 500)
  }
}