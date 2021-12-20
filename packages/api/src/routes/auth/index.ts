import { Router } from "express"
import { login, refreshToken, signUp, validateToken } from "./controller"

const router = Router()

router.post('/login', login)
router.post('/signup', signUp)
router.post('/validatejwt', validateToken)
router.post('/refreshtoken', refreshToken)

export default router