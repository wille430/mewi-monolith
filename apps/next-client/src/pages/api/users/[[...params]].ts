import { createHandler } from 'next-api-decorators'
import { UsersController } from '@/lib/modules/users/users.controller'

export default createHandler(UsersController)
