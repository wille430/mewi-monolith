import { faker } from '@faker-js/faker'
import { createUserWatcherFactory } from '@mewi/prisma/factory'
import { WatcherFactory } from './WatcherFactory'
import { CreateFactoryReturn } from 'prisma-factory'
import { Prisma, UserWatcher } from '@mewi/prisma'

export const UserWatcherFactory: CreateFactoryReturn<Prisma.UserWatcherCreateInput, UserWatcher> =
    createUserWatcherFactory({
        id: faker.database.mongodbObjectId,
        createdAt: faker.date.recent,
        updatedAt: faker.date.recent,
        notifiedAt: faker.date.recent,
        watcher: {
            create: WatcherFactory.build(),
        },
    })
