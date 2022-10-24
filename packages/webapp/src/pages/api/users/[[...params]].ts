import { createHandler } from 'next-api-decorators'
import { UsersController } from '@/backend/modules/users/users.controller'

export default createHandler(UsersController)
