import {createHandler} from '@/lib/middlewares/createHandler'
import { ListingsController } from '@/lib/modules/listings/listings.controller'

export default createHandler(ListingsController)
