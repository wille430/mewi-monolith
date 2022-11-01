import type { ReactElement } from 'react'
import { Layout } from '../Layout/Layout'

export const BasicLayout = ({ children }: { children: ReactElement }) => (
    <Layout>
        <div className='basic-layout'>{children}</div>
    </Layout>
)
