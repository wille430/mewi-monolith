import { Router } from 'express'
import Authentication from '../../middleware/Authentication'
import app from '../app'
import { getInfo } from './controller'
import Watchers from './watchers'

const router = Router()

router.use(Authentication.authenticateJWT)

router.get('/', getInfo)
router.use('/watchers', Watchers)

export default router
