import { Router } from 'express'
import { findById } from '../search/controller'

const router = Router()

router.get('/:item_id', findById)

export default router
