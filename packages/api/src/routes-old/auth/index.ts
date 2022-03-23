import { Router } from 'express'
import { login, refreshToken, signUp, validateToken } from './controller'
import Password from './password'

const router = Router()

router.post('/login', login)
router.post('/signup', signUp)
router.post('/validatejwt', validateToken)
router.post('/refreshtoken', refreshToken)

router.use('/password', Password)

export default router
