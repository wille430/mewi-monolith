import { createHandler } from 'next-api-decorators'
import { ScrapersController } from '@/lib/modules/scrapers/scrapers.controller'

export default createHandler(ScrapersController)
