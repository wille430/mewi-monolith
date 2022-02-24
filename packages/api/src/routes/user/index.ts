import { Router } from 'express'
import { authenticateJWT } from '../../middleware/Authentication'
import { getInfo } from './controller'
import Watchers from './watchers'

const router = Router()

router.use(authenticateJWT)

router.get('/', getInfo)
router.use('/watchers', Watchers)

export default router
