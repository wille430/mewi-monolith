import { Role } from '@wille430/common'
import { adminStub } from './admin.stub'
import { UserPayload } from '@/backend/modules/common/types/UserPayload'

export const adminUserPayloadStub = (): UserPayload => ({
    userId: adminStub().id,
    email: adminStub().email,
    roles: [Role.ADMIN, Role.USER],
})
