import {UserPayload} from '@/lib/modules/common/types/UserPayload'
import {userStub} from './user.stub'
import {Role} from "@mewi/models"

export const userPayloadStub = (): UserPayload => ({
    userId: userStub().id,
    email: userStub().email,
    roles: [Role.USER],
})
