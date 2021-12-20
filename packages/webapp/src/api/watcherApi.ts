import { ElasticQuery, PublicWatcher, SearchFilterDataProps, WatcherMetadata } from '@mewi/types'
import axios from 'axios'
import { SearchParamsUtils } from 'utils'

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

export const createWatcher = async (searchFilterData: SearchFilterDataProps) => {

    const body = {
        searchFilters: searchFilterData
    }

    const newWatcher: PublicWatcher = await axios.post('/user/watchers', body)
        .then(res => res.data.watcher)
        .catch(err => {throw err})
    return newWatcher
}

export const updateWatcher = async (watcherId: string, newSearchFilterData: SearchFilterDataProps) => {

    const body = {
        searchFilters: newSearchFilterData
    }

    const newWatcher = await axios.patch('/user/watchers' + watcherId, body).then(res => res.data.watcher)
    return newWatcher
}