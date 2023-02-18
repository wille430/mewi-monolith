import {createHandler} from '@/lib/middlewares/createHandler'
import { AuthController } from '@/lib/modules/auth/auth.controller'
import {mongodbMiddleware} from "@/lib/middlewares/mongodbMiddleware"

export default mongodbMiddleware(createHandler(AuthController))
