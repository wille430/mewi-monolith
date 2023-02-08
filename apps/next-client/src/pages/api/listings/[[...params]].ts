import { createHandler } from 'next-api-decorators'
import { ListingsController } from '@/lib/modules/listings/listings.controller'

export default createHandler(ListingsController)
