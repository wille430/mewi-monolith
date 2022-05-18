import { ConflictException, HttpStatus, Injectable } from '@nestjs/common'
import { Error } from '@wille430/common'
import { UserWatcher, Watcher } from '@mewi/prisma'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { WatchersService } from '@/watchers/watchers.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserWatchersService {
    constructor(private watchersService: WatchersService, private prisma: PrismaService) {}

    async create({
        userId,
        metadata,
    }: CreateUserWatcherDto): Promise<(UserWatcher & { watcher: Watcher }) | null> {
        let watcher = await this.prisma.watcher.findFirst({ where: { metadata } })

        // 1. Create new watcher if watcher doesn't exist already
        if (!watcher) {
            watcher = await this.prisma.watcher.create({ data: { metadata } })
        }

        // 2. Append user watcher to user
        const user = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!user) return null

        // 2. If user is already subscribed to the watcher, throw error
        if (
            await this.prisma.userWatcher.count({
                where: {
                    userId: user.id,
                    watcherId: watcher.id,
                },
            })
        ) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: ['You are already subscribed to a similar watcher'],
                error: Error.Database.CONFLICTING_RESOURCE,
            })
        } else {
            const userWatcher = await this.prisma.userWatcher.create({
                data: {
                    userId: user.id,
                    watcherId: watcher.id,
                },
                include: {
                    watcher: true,
                },
            })

            return userWatcher
        }
    }

    async findAll(userId: string): Promise<(UserWatcher & { watcher: Watcher })[] | null> {
        try {
            return await this.prisma.userWatcher.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    watcher: true,
                },
            })
        } catch (e) {
            return []
        }
    }

    async findOne(
        id: string,
        userId: string
    ): Promise<(UserWatcher & { watcher: Watcher }) | null> {
        try {
            return await this.prisma.userWatcher.findFirst({
                where: {
                    id: id,
                    userId: userId,
                },
                include: {
                    watcher: true,
                },
            })
        } catch (e) {
            return null
        }
    }

    async update(
        id: string,
        { userId, metadata }: UpdateUserWatcherDto
    ): Promise<(UserWatcher & { watcher: Watcher }) | null> {
        this.remove(id, userId)
        return this.create({ metadata, userId })
    }

    /**
     * Unsubscribe a user from a watcher
     *
     * @param id - The id of the user watcher
     * @param userId - The id of the user
     * @returns True if the user watcher was deleted, else false
     */
    async remove(id: string, userId: string): Promise<boolean> {
        const { watcherId } =
            (await this.prisma.userWatcher.findFirst({
                where: {
                    id,
                    userId,
                },
            })) ?? {}
        if (!watcherId) return false

        // delete from user
        await this.prisma.userWatcher.deleteMany({
            where: {
                id,
                userId,
            },
        })

        // delete watcher if no one is subscribed

        const subCount = await this.watchersService.subscriberCount(watcherId)

        if (subCount <= 0) {
            await this.prisma.watcher.delete({
                where: {
                    id: watcherId,
                },
            })
        }

        return true
    }
}
