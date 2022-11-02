import { createHandler } from 'next-api-decorators'
import { MyWatchersController } from '@/backend/modules/user-watchers/user-watchers.controller'

export default createHandler(MyWatchersController)
