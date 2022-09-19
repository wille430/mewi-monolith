import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@mewi/prisma'
import { userMiddleware } from './user.middleware'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect().catch((e) => {
            if (process.env.NODE_ENV !== 'test') {
                throw e
            }
        })
        this.$use(userMiddleware)
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }

    /**
     * Aggregation which returns objects which conform to the prisma JSON shape
     *
     * @param args - Aggregation arguments
     * @returns Array of the specified models documents
     */
    async improvedAggregate<T extends Record<string, any>>(
        model: T,
        args: Parameters<T['aggregateRaw']>[0] & { pipeline: any[] }
    ): Promise<Awaited<ReturnType<T['findMany']>>> {
        if (!args.pipeline) args.pipeline = []

        args.pipeline.push({
            $group: { _id: null, array: { $push: '$_id' } },
        })
        const ids = await model
            .aggregateRaw(args)
            .then((o: any) => (o[0] ? o[0]['array'].map((o: any) => o.$oid) : []))

        const items: any[] =
            (await model.findMany({
                where: {
                    id: { in: ids },
                },
            })) ?? []

        return ids.map((x: any) => items.find((y) => y.id === x))
    }
}
