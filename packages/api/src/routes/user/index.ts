import { Router } from 'express'
import { authenticateJWT } from '../../middleware/Authentication'
import { getInfo, updateUserInfo } from './controller'
import Watchers from './watchers'
import Password from './password'

const router = Router()

router.use(authenticateJWT)

router.get('/', getInfo)
router.put('/', updateUserInfo)
router.use('/watchers', Watchers)
router.use('/password', Password)

export default router
