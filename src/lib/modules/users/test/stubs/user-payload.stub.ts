import { Role } from '@/common/schemas'
import { UserPayload } from '@/lib/modules/common/types/UserPayload'
import { userStub } from './user.stub'

export const userPayloadStub = (): UserPayload => ({
    userId: userStub().id,
    email: userStub().email,
    roles: [Role.USER],
})
