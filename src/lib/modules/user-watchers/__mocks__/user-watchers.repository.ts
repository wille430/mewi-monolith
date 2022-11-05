import { createRepositoryMock } from '@/test/createRepositoryMock'
import { userWatcherStub } from '../test/user-watcher.stub'

export const UserWatchersRepository = createRepositoryMock(userWatcherStub())
