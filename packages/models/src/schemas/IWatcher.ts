import { IEntity } from './IEntity'
import { WatcherMetadataDto } from '../WatcherMetadataDto'

export interface IWatcher extends IEntity {
    id: string
    metadata: WatcherMetadataDto
    notifiedAt?: Date
}
