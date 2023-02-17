import { adminStub } from './admin.stub'
import { UserPayload } from '@/lib/modules/common/types/UserPayload'
import {Role} from "@mewi/models"

export const adminUserPayloadStub = (): UserPayload => ({
    userId: adminStub().id,
    email: adminStub().email,
    roles: [Role.ADMIN, Role.USER],
})
