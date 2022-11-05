import { createRepositoryMock } from '@/test/createRepositoryMock'
import { watcherStub } from '../test/stubs/watcher.stub'

export const WatchersRepository = createRepositoryMock(watcherStub())
