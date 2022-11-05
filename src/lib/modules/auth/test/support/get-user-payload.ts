import type { UserPayload } from '@/lib/modules/common/types/UserPayload'
import type { User } from '@/lib/modules/schemas/user.schema'

export const getUserPayload = (user: User): UserPayload => ({
    userId: user.id,
    email: user.email,
    roles: user.roles,
})
