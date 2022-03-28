import { Test, TestingModule } from '@nestjs/testing'
import { WatchersController } from './watchers.controller'
import { WatchersService } from './watchers.service'

describe('WatchersController', () => {
    let controller: WatchersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WatchersController],
            providers: [WatchersService],
        }).compile()

        controller = module.get<WatchersController>(WatchersController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
