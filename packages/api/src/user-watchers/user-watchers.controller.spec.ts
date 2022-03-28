import { Test, TestingModule } from '@nestjs/testing'
import { UserWatchersController } from './user-watchers.controller'
import { UserWatchersService } from './user-watchers.service'

describe('UserWatchersController', () => {
  let controller: UserWatchersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWatchersController],
      providers: [UserWatchersService],
    }).compile()

    controller = module.get<UserWatchersController>(UserWatchersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
