import { Role } from '@mewi/prisma'

export const userMiddleware = async (params: any, next: any) => {
    if (params.model === 'User' && params.action === 'create') {
        if (!params.args.data.roles) {
            params.args.data.roles = []
        }

        if (params.args.data.roles.indexOf(Role.USER) === -1) {
            params.args.data.roles = [...params.args.data.roles, Role.USER]
        }

        const result = await next(params)

        return result
    } else {
        return await next(params)
    }
}
