import { userStub } from './user.stub'
import type { UserPayload } from '@/auth/jwt-strategy'

export const userPayloadStub = (): UserPayload => ({
    userId: userStub().id,
    email: userStub().email,
})
