import { Container } from '@mewi/ui'
import { Role } from '@mewi/prisma/index-browser'
import styles from './SideNav.module.scss'
import SideNavButton from './SideNavButton/SideNavButton'
import { useUser } from '@/lib/useUser'

const SideNav = () => {
    const { user } = useUser()

    return (
        <Container className={styles.container}>
            <h4>Mina Sidor</h4>

            <ul>
                <SideNavButton href='/minasidor/bevakningar'>Mina Bevakningar</SideNavButton>
                <SideNavButton href='/minasidor/konto'>Mitt Konto</SideNavButton>
                {user?.roles.includes(Role.ADMIN) && (
                    <SideNavButton href='/admin'>Admin</SideNavButton>
                )}
            </ul>
        </Container>
    )
}

export default SideNav
