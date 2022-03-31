import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'

describe('AuthService', () => {
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
            imports: [UsersModule]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
