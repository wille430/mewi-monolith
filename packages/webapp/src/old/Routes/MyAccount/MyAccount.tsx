import { Container, HorizontalLine } from '@mewi/ui'
import Layout from 'components/Layout'
import SideNav from 'components/SideNav/SideNav'
import AccountDetails from './AccountDetails/AccountDetails'

const MyAccount = () => {
    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main'>
                <Container style={{ minHeight: '50vh' }}>
                    <Container.Header>
                        <h3>Mitt Konto</h3>
                        <HorizontalLine />
                    </Container.Header>

                    <Container.Content>
                        <AccountDetails />
                    </Container.Content>
                    <Container.Footer></Container.Footer>
                </Container>
            </main>
            <aside className='side-col'>
                <SideNav />
            </aside>
        </Layout>
    )
}

export default MyAccount
