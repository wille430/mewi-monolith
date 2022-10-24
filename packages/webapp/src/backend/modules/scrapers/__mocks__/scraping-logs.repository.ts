import { scrapingLogStub } from '../test/stubs/scraping-log.stub'
import { createRepositoryMock } from '@/common/test/createRepositoryMock'

export const ScrapingLogsRepository = createRepositoryMock(scrapingLogStub())
