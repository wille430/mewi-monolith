import { Router } from 'express'
import { forgottenPassword, changePassword } from './controller'

const router = Router()

router.put('/', changePassword)
router.post('/reset', forgottenPassword)

export default router
