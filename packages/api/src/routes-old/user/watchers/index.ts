import { Router } from 'express'
import { create, getAll, getById, remove, update } from './controller'

const router = Router()

router.post('/', create)
router.get('/', getAll)

router.get('/:watcher_id', getById)
router.patch('/:watcher_id', update)
router.delete('/:watcher_id', remove)

export default router
