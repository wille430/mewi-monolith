import { Router } from 'express'
import FeaturedListingModel from 'models/FeaturedListingModel'

const router = Router()

router.get('/', async (req, res, next) => {
    const listings = await FeaturedListingModel.aggregate([{ $sample: { size: 5 } }])

    res.json(listings)
})

export default router
