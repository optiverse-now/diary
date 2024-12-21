import { Hono } from 'hono'
import * as diaryController from '../controllers/diary'

const router = new Hono()

router.get('/', diaryController.getDiaries) // 日記一覧取得
router.post('/', diaryController.createDiary) // 日記作成
router.get('/:id', diaryController.getDiary) // 日記詳細取得
router.put('/:id', diaryController.updateDiary) // 日記更新

export default router