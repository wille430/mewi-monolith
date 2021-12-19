import { Router } from 'express'
import PaymentController from 'controllers/PaymentController'

const router = Router()

router.post('/new_session', PaymentController.createSession)

export default router