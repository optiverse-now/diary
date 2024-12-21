import { Context } from 'hono'
import { prisma } from '../lib/prisma'

// 日記一覧取得
export const getDiaries = async (c: Context) => {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 9
  const skip = (page - 1) * limit

  try {
    const [diaries, total] = await Promise.all([
      prisma.diary.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.diary.count(),
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
    return c.json({ error: 'Failed to fetch diaries' }, 500)
  }
}

// 日記作成
export const createDiary = async (c: Context) => {
  try {
    const body = await c.req.json()
    const diary = await prisma.diary.create({
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood || '',
        tags: body.tags || '',
      },
    })
    return c.json(diary, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create diary' }, 500)
  }
}

// 日記詳細取得
export const getDiary = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const diary = await prisma.diary.findUnique({
      where: { id: Number(id) },
    })
    if (!diary) {
      return c.json({ error: 'Diary not found' }, 404)
    }
    return c.json(diary)
  } catch (error) {
    return c.json({ error: 'Failed to fetch diary' }, 500)
  }
}

// 日記更新
export const updateDiary = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const diary = await prisma.diary.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        content: body.content,
        mood: body.mood || '',
        tags: body.tags || '',
      },
    })
    return c.json(diary)
  } catch (error) {
    return c.json({ error: 'Failed to update diary' }, 500)
  }
}