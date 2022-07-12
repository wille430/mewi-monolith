import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@mewi/prisma'
import { userMiddleware } from './user.middleware'
import { improvedAggregate } from './helpers/improved-aggregate'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
        this.$use(userMiddleware)
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }

    improvedAggregate = improvedAggregate
}
