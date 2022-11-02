import { createRepositoryMock } from '../../common/test/createRepositoryMock'
import { scrapingLogStub } from '../test/stubs/scraping-log.stub'

export const ScrapingLogsRepository = createRepositoryMock(scrapingLogStub())
