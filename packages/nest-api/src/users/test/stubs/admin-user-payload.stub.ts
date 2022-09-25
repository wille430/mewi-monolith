import { UserPayload } from '@/auth/jwt-strategy'
import { adminStub } from './admin.stub'

export const adminUserPayloadStub = (): UserPayload => ({
    userId: adminStub().id,
    email: adminStub().email,
})
