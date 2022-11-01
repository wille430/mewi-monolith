import type { GetServerSideProps } from 'next'
import { Role } from '@wille430/common'
import type { ReactElement } from 'react'
import Head from 'next/head'
import { EditRolePanel } from './../../components/EditRolePanel/EditRolePanel'
import { ScraperPanel } from './../../components/ScraperPanel/ScraperPanel'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { withAuth } from '@/backend/lib/session/withAuth'
import { Container } from '@/components/Container/Container'

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
    return {
        props: {},
    }
}, [Role.ADMIN])

const AdminIndex = () => {
    return (
        <>
            <Head>
                <title>Admin | Mewi.se</title>
            </Head>

            <Container
                style={{
                    minHeight: '40vw',
                }}
            >
                <Container.Header>
                    <h3>Admin panel</h3>
                </Container.Header>
                <Container.Content className='space-y-4'>
                    <ScraperPanel />
                    <EditRolePanel />
                </Container.Content>
            </Container>
        </>
    )
}

AdminIndex.getLayout = (component: ReactElement) => <MyAccountLayout>{component}</MyAccountLayout>

export default AdminIndex
