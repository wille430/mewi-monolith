import type { GetServerSideProps } from 'next'
import type { ReactElement } from 'react'
import Head from 'next/head'
import { MyAccountLayout } from '@/lib/components/MyPagesLayout/MyPagesLayout'
import { withAuth } from '@/lib/session/withAuth'
import { Container } from '@/lib/components/Container/Container'
import { Role } from '@/common/schemas'
import { ScraperPanel } from '@/lib/components/ScraperPanel/ScraperPanel'
import { EditRolePanel } from '@/lib/components/EditRolePanel/EditRolePanel'

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
