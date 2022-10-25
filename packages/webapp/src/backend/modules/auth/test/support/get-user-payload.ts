import type { UserPayload } from '@/backend/modules/common/types/UserPayload'
import type { User } from '@/backend/modules/schemas/user.schema'

export const getUserPayload = (user: User): UserPayload => ({
    userId: user.id,
    email: user.email,
    roles: user.roles,
})
