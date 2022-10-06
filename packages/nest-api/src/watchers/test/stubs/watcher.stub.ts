import { timestampsStub } from '@/common/test/stubs/timestamps.stub'
import { IWatcher } from '@wille430/common'
import { WithId } from 'mongodb'
import mongoose from 'mongoose'

const notifiedAt = new Date(Date.now() - 99999)
const id = '6335c3600ad468323536e432'
export const watcherStub = (): WithId<IWatcher> => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    metadata: {
        keyword: 'volvo',
    },
    notifiedAt: notifiedAt,
    ...timestampsStub(),
})
