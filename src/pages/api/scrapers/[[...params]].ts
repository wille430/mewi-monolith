import { createHandler } from 'next-api-decorators'
import { ScrapersController } from '@/backend/modules/scrapers/scrapers.controller'

export default createHandler(ScrapersController)
