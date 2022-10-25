import { createHandler } from 'next-api-decorators'
import { UserWatchersController } from '@/backend/modules/user-watchers/user-watchers.controller'

export default createHandler(UserWatchersController)
