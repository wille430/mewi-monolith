import { UserPayload } from '@/auth/jwt-strategy'
import { User } from '@/schemas/user.schema'

export const getUserPayload = (user: User): UserPayload => ({
    email: user.email,
    userId: user.id,
})
