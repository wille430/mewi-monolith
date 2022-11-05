import 'reflect-metadata'
import { container } from 'tsyringe'
import { User } from '../../schemas/user.schema'
import { UserWatchersRepository } from '../../user-watchers/user-watchers.repository'
import { userStub } from '../../users/test/stubs/user.stub'
import { UsersRepository } from '../../users/users.repository'
import { WatchersRepository } from '../watchers.repository'
import { WatchersService } from '../watchers.service'
import { watcherStub } from './stubs/watcher.stub'

jest.mock('../watchers.repository')
jest.mock('../../user-watchers/user-watchers.repository')

describe('WatchersService', () => {
    let watchersService: WatchersService
    let watchersRepository: WatchersRepository
    let userWatchersRepository: UserWatchersRepository
    let usersRepository: UsersRepository

    beforeEach(async () => {
        watchersService = container.resolve(WatchersService)
        watchersRepository = container.resolve(WatchersRepository)
        usersRepository = container.resolve(UsersRepository)
        userWatchersRepository = container.resolve(UserWatchersRepository)

        jest.clearAllMocks()
    })

    describe('#getUsersInWatcher', () => {
        let users: User[]

        beforeEach(async () => {
            userWatchersRepository
            users = await watchersService.getUsersInWatcher(watcherStub().id)
        })

        it('then it should call the userWatchersRepository', () => {
            expect(userWatchersRepository.aggregate).toHaveBeenCalled()
        })

        it('then it should return users', () => {
            expect(users).toEqual([userStub()])
        })
    })
})
