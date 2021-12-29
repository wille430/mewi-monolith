import { Router } from 'express'
import { APIError } from '@mewi/types'

const router = Router()

router.use((req, res, next) => {
    const error = new APIError(400, 'not found')
    next(error)
})

export default router
