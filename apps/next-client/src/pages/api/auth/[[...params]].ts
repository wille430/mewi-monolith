import { createHandler } from 'next-api-decorators'
import { AuthController } from '@/lib/modules/auth/auth.controller'

export default createHandler(AuthController)
