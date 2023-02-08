import type { NextPage } from '@/lib/types/next'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}
