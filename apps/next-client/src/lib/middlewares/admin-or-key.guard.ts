import {adminApiKeyMiddleware} from './admin-api-key.middleware'
import {AnyGuard} from './any.guard'
import {rolesMiddleware} from './roles.guard'
import {Role} from "@mewi/models"

export const AdminOrKeyGuard = () => AnyGuard(adminApiKeyMiddleware, rolesMiddleware(Role.ADMIN))
