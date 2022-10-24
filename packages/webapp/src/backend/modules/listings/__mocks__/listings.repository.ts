import { listingStub } from '../test/stubs/listing.stub'
import { createRepositoryMock } from '@/common/test/createRepositoryMock'

export const ListingsRepository = createRepositoryMock(listingStub())
