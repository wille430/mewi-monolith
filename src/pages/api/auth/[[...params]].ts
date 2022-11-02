import { createHandler } from 'next-api-decorators'
import { AuthController } from '@/backend/modules/auth/auth.controller'

export default createHandler(AuthController)
