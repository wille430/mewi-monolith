import { AxiosResponse } from 'axios'

export type PageDetails = {
    url: string
    currentPage: number
    maxPages?: (res: AxiosResponse) => number
    getMostRecentDate: () => Date | undefined
}
