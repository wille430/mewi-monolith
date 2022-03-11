import { Router } from 'express'
import { forgottenPassword, resetPassword } from './controller'

const router = Router()

router.put('/', resetPassword)
router.post('/reset', forgottenPassword)

export default router
