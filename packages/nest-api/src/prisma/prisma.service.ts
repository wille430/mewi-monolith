import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Role } from '@mewi/prisma'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()

        this.$use(async (params, next) => {
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
        })
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }
}
