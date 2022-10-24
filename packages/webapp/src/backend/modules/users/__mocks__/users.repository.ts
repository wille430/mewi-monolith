import { userStub } from '../test/stubs/user.stub'
import { createRepositoryMock } from '@/common/test/createRepositoryMock'

export const UsersRepository = createRepositoryMock(userStub())
