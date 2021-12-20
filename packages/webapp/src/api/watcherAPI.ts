import axios from 'axios'
import { ElasticQuery, WatcherMetadata } from 'types/types'

const { NX_API_URL } = process.env

export const getWatchers = async () => {
    const watchers = await axios.get(NX_API_URL + '/user/watchers').then(res => res.data)
    return watchers
}

export const getWatcher = async (watcherId: string) => {
    const watcher = await axios.get(NX_API_URL + '/user/watchers/' + watcherId).then(res => res.data)
    return watcher
}

export const deleteWatcher = async (watcherId: string) => {
    await axios.delete(NX_API_URL + '/user/watchers/' + watcherId)
}

interface createWatcherProps {
    metadata: WatcherMetadata,
    query: ElasticQuery
}

export const createWatcher = async ({ metadata, query }: createWatcherProps) => {
    const newWatcher = await axios.post(NX_API_URL + '/user/watchers', { metadata, query })
    return newWatcher
}

interface updateWatcherProps extends createWatcherProps {

}

export const updateWatcher = async (watcherId: string, { metadata, query }: updateWatcherProps) => {
    const newWatcher = await axios.patch(NX_API_URL + '/user/watchers' + watcherId, { metadata, query })
    return newWatcher
}