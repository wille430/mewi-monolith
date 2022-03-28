import { Test, TestingModule } from '@nestjs/testing'
import { UserWatchersService } from './user-watchers.service'

describe('UserWatchersService', () => {
    let service: UserWatchersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserWatchersService],
        }).compile()

        service = module.get<UserWatchersService>(UserWatchersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
