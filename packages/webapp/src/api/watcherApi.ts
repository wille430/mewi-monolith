import { Types } from '@mewi/common'
import axios from 'axios'

const getWatchers = async (): Promise<Types.JoinedWatcher[]> => {
    const watchers = await axios
        .get('/user/watchers')
        .then((res) => res.data.watchers)
        .catch((err) => {
            throw err
        })
    return watchers
}

const getWatcher = async (watcherId: string): Promise<Types.JoinedWatcher> => {
    const watcher = await axios.get('/user/watchers/' + watcherId).then((res) => res.data.watcher)
    return watcher
}

const deleteWatcher = async (watcherId: string): Promise<void> => {
    await axios.delete('/user/watchers/' + watcherId)
}

const createWatcher = async (
    searchFilterData: Types.SearchFilterDataProps
): Promise<Types.JoinedWatcher> => {
    const body = {
        searchFilters: searchFilterData,
    }

    const newWatcher = await axios
        .post('/user/watchers', body)
        .then((res) => res.data.watcher)
        .catch((err) => {
            throw err
        })
    return newWatcher
}

const updateWatcher = async (
    watcherId: string,
    newSearchFilterData: Types.SearchFilterDataProps
): Promise<Types.JoinedWatcher> => {
    const body = {
        searchFilters: newSearchFilterData,
    }

    const newWatcher = await axios
        .patch('/user/watchers' + watcherId, body)
        .then((res) => res.data.watcher)
    return newWatcher
}

export default {
    getWatchers,
    getWatcher,
    deleteWatcher,
    createWatcher,
    updateWatcher,
}
