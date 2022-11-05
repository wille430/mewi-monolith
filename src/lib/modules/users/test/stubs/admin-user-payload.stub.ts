import { Role } from '@/common/schemas'
import { adminStub } from './admin.stub'
import { UserPayload } from '@/lib/modules/common/types/UserPayload'

export const adminUserPayloadStub = (): UserPayload => ({
    userId: adminStub().id,
    email: adminStub().email,
    roles: [Role.ADMIN, Role.USER],
})
