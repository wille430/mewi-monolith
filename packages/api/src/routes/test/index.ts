import { Router } from 'express'
import { createTestUser } from './controller'


const router = Router()

router.post('/user', createTestUser)

export default router