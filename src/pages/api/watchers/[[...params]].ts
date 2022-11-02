import { createHandler } from 'next-api-decorators'
import { WatchersController } from '@/backend/modules/watchers/watchers.controller'

export default createHandler(WatchersController)
