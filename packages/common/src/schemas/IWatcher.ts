import { IWatcherMetadata } from './IWatcherMetadata'

export interface IWatcher {
    id: string
    metadata: IWatcherMetadata
    notifiedAt?: Date
}
