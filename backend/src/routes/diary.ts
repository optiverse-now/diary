import { Hono } from 'hono'
import * as diaryController from '../controllers/diary'
import { authMiddleware } from '../middleware/auth'

const router = new Hono()

// すべてのルートに認証ミドルウェアを適用
router.use('/*', authMiddleware)

router.get('/', diaryController.getDiaries) // 日記一覧取得
router.post('/', diaryController.createDiary) // 日記作成
router.get('/:id', diaryController.getDiary) // 日記詳細取得
router.put('/:id', diaryController.updateDiary) // 日記更新
router.delete('/:id', diaryController.deleteDiary) // 日記削除

export default router