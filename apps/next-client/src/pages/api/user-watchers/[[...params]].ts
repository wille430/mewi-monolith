import { createHandler } from 'next-api-decorators'
import { MyWatchersController } from '@/lib/modules/user-watchers/user-watchers.controller'

export default createHandler(MyWatchersController)
