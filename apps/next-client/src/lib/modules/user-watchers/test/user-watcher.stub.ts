import { timestampsStub } from '@/test/stubs/timestamps.stub'
import type { WithId } from 'mongodb'
import mongoose from 'mongoose'
import { UserWatcher } from '@mewi/entities'
import { userStub } from '../../users/test/stubs/user.stub'
import { watcherStub } from '../../watchers/test/stubs/watcher.stub'

const id = '6336ec2f0fce785ab7fb1d31'
export const userWatcherStub = (): WithId<UserWatcher> => ({
    _id: new mongoose.Types.ObjectId(id),
    id,
    user: userStub(),
    watcher: watcherStub(),
    ...timestampsStub(),
})

export const createUserWatcherStub = (): Omit<WithId<UserWatcher>, 'user' | 'watcher'> & {
    user: any
    watcher: any
} => ({
    ...userWatcherStub(),
    user: userStub()._id,
    watcher: watcherStub()._id,
})
