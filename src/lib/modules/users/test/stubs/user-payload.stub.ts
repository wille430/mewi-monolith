import { Role } from '@/common/schemas'
import { userStub } from './user.stub'
import { UserPayload } from '@/backend/modules/common/types/UserPayload'

export const userPayloadStub = (): UserPayload => ({
    userId: userStub().id,
    email: userStub().email,
    roles: [Role.USER],
})
