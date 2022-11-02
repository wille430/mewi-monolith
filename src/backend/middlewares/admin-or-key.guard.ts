import { Role } from '@/common/schemas'
import { adminApiKeyMiddleware } from './admin-api-key.middleware'
import { AnyGuard } from './any.guard'
import { rolesMiddleware } from './Roles'

export const AdminOrKeyGuard = () => AnyGuard(adminApiKeyMiddleware, rolesMiddleware(Role.ADMIN))
