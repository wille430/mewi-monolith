import { createHandler } from 'next-api-decorators'
import { WatchersController } from '@/lib/modules/watchers/watchers.controller'

export default createHandler(WatchersController)
