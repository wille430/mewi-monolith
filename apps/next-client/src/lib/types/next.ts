import type {ReactElement, ReactNode} from 'react'
import {NextPage} from "next"

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}
