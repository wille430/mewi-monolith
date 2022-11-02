import { createHandler } from 'next-api-decorators'
import { ListingsController } from '@/backend/modules/listings/listings.controller'

export default createHandler(ListingsController)
