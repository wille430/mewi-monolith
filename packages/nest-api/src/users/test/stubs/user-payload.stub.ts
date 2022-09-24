import { UserPayload } from '@/auth/jwt-strategy'
import { userStub } from './user.stub'

export const userPayloadStub = (): UserPayload => ({
    userId: userStub().id,
    email: userStub().email,
})
