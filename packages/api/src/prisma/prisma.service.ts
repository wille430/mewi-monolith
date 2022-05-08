import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Role } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()

        this.$use(async (params, next) => {
            if (params.model === 'User') {
                if (params.args.data.roles.indexOf(Role.USER) === -1) {
                    params.args.data.roles = [...params.args.data.roles, Role.USER]
                } else if (!params.args.data.roles) {
                    params.args.data.roles = [Role.USER]
                }

                const result = await next(params)

                return result
            }
        })
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }
}
