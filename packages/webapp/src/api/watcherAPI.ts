import { JWT } from '@mewi/types'
import axios from 'axios'

const { NX_API_URL } = process.env

export const getWatchers = async (token: JWT) => {
    const watchers = await axios.get(NX_API_URL + '/user/watchers').then(res => res.data)
    return watchers
}

export const getWatcher = async (token: JWT, watcherId: string) => {
    const watcher = await axios.get(NX_API_URL + '/user/watchers/' + watcherId).then(res => res.data)
    return watcher
}

export const deleteWatcher = async (token: JWT, watcherId: string) => {
    await axios.delete(NX_API_URL + '/user/watchers/' + watcherId)
}

export const createWatcher = async (token: JWT, {metadata, query}) => {
    await axios.post(NX_API_URL + '/user/watchers')
}