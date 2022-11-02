import { createRepositoryMock } from '../../common/test/createRepositoryMock'
import { listingStub } from '../test/stubs/listing.stub'

export const ListingsRepository = createRepositoryMock(listingStub())
