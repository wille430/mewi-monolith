import { Router } from 'express'
import { authenticateJWT } from '../../middleware/Authentication'
import { getInfo, updateUserInfo } from './controller'
import Watchers from './watchers'

const router = Router()

router.use(authenticateJWT)

router.get('/', getInfo)
router.put('/', updateUserInfo)
router.use('/watchers', Watchers)

export default router
