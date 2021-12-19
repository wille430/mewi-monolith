import { Router } from "express"
import { login, signUp, validateToken } from "./controller"

const router = Router()

router.post('/login', login)
router.post('/signup', signUp)
router.post('validatejwt', validateToken)

export default router