import { Router } from 'express'
import { getAll, suggest, getSearchResults } from './controller'

const router = Router()

router.get('/', getAll)
router.post('/', getSearchResults)

router.get('/suggest/:keyword', suggest)

export default router
