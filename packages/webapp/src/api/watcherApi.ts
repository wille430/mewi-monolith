import { ElasticQuery, PublicWatcher, WatcherMetadata } from '@mewi/types'
import axios from 'axios'

export const getWatchers = async () => {
    const watchers: PublicWatcher[] = await axios.get('/user/watchers')
        .then(res => res.data.watchers)
        .catch(err => {throw err})
    return watchers
}

export const getWatcher = async (watcherId: string) => {
    const watcher: PublicWatcher = await axios.get('/user/watchers/' + watcherId).then(res => res.data.watcher)
    return watcher
}

export const deleteWatcher = async (watcherId: string) => {
    await axios.delete('/user/watchers/' + watcherId)
}

interface createWatcherProps {
    metadata: WatcherMetadata,
    query: ElasticQuery
}

export const createWatcher = async ({ metadata, query }: createWatcherProps) => {
    const newWatcher: PublicWatcher = await axios.post('/user/watchers', { metadata, query })
        .then(res => res.data.watcher)
        .catch(err => {throw err})
    return newWatcher
}

interface updateWatcherProps extends createWatcherProps {

}

export const updateWatcher = async (watcherId: string, { metadata, query }: updateWatcherProps) => {
    const newWatcher = await axios.patch('/user/watchers' + watcherId, { metadata, query }).then(res => res.data.watcher)
    return newWatcher
}