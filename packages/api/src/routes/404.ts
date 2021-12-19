import { Router } from "express"
import { APIError } from "types/errorCodes"

const router = Router()

router.use((req, res, next) => {
    const error = new APIError(400, 'not found')
    next(error)
})

export default router