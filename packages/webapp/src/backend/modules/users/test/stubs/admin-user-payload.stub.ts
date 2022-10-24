import { adminStub } from './admin.stub'
import type { UserPayload } from '@/auth/jwt-strategy'

export const adminUserPayloadStub = (): UserPayload => ({
    userId: adminStub().id,
    email: adminStub().email,
})
