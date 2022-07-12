import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@mewi/prisma'
import { userMiddleware } from './user.middleware'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super()
    }

    async onModuleInit() {
        await this.$connect()
        this.$use(userMiddleware)
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }

    async improvedAggregate<T extends Record<string, any>>(
        model: T,
        ...args: Parameters<T['aggregateRaw']>
    ): Promise<Awaited<ReturnType<T['findMany']>>> {
        const ids = await model.aggregateRaw(...args).then((o) => o[0]['array'].map((o) => o.$oid))

        return model.findMany({
            where: {
                id: { in: ids },
            },
        })
    }
}
