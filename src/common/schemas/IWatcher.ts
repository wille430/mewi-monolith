import { IEntity } from './IEntity'
import { IWatcherMetadata } from './IWatcherMetadata'

export interface IWatcher extends IEntity {
    id: string
    metadata: IWatcherMetadata
    notifiedAt?: Date
}
