import { GetServerSideProps } from 'next'
import { Role } from '@mewi/prisma/index-browser'
import { ReactElement } from 'react'
import { Container } from '@mewi/ui'
import Head from 'next/head'
import { EditRolePanel } from './../../components/EditRolePanel/EditRolePanel'
import { ScraperPanel } from './../../components/ScraperPanel/ScraperPanel'
import { withAuth } from '@/lib/auth'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'

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
