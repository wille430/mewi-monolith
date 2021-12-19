import { WatcherMetadata } from "types/types"

const { NX_API_URL } = process.env

interface WatcherState {
    id: string,
    [key: string]: any
}

const UserAPI = {
    getWatchers: async (jwtToken: string | null): Promise<WatcherState[]> => {

        if (!jwtToken) return []

        const response = await fetch(NX_API_URL + "/user/watchers", {
            method: "GET",
            headers: new Headers({
                'Authorization': 'Bearer ' + jwtToken
            })
        })

        const resBody = await response.json()

        if (response.ok) {
            return resBody
        } else {
            throw resBody
        }
    },
    addWatcher: async (jwtToken: string | null, searchQuery: object, metadata: WatcherMetadata): Promise<any | null | undefined> => {
        if (!jwtToken || !searchQuery) return

        const response = await fetch(NX_API_URL + "/user/watchers", {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer ' + jwtToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ query: searchQuery, metadata: metadata })
        })

        const jsonRes = await response.json()

        if (response.ok) {
            return jsonRes
        } else {
            throw jsonRes
        }
    },
    getWatcherById: async (jwtToken: string | null, watcher_id: string): Promise<object | null> => {
        if (!jwtToken) return null

        const response = await fetch(NX_API_URL + "/user/watchers/" + watcher_id, {
            method: "GET",
            headers: new Headers({
                'Authorization': 'Bearer ' + jwtToken,
                'Content-Type': 'application/json'
            })
        })

        const resObj = await response.json()

        if (response.ok) {
            return resObj
        } else {
            throw resObj
        }
    },
    removeWatcherById: async (jwtToken: string | null, watcher_id: string): Promise<string | null> => {
        if (!jwtToken) return null

        const url = NX_API_URL + "/user/watchers/" + watcher_id

        const response = await fetch(url, {
            method: "DELETE",
            headers: new Headers({
                'Authorization': 'Bearer ' + jwtToken,
                'Content-Type': 'application/json'
            })
        })

        if (response.ok) {
            return response.text()
        } else {
            throw await response.json()
        }
    }
}

export default UserAPI