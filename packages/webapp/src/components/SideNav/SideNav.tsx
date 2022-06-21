import { Container } from '@wille430/ui'
import { Role } from '@mewi/prisma/index-browser'
import styles from './SideNav.module.scss'
import SideNavButton from './SideNavButton/SideNavButton'
import { useAppSelector } from '@/hooks'

const SideNav = () => {
    const { user } = useAppSelector((state) => state.user)

    return (
        <Container className={styles.container} data-testid='side-nav'>
            <h4>Mina Sidor</h4>

            <ul>
                <SideNavButton href='/minasidor/bevakningar'>Bevakningar</SideNavButton>
                <SideNavButton href='/minasidor/konto'>Konto</SideNavButton>
                <SideNavButton href='/minasidor/gillade'>Gillade produkter</SideNavButton>
                {user?.roles?.includes(Role.ADMIN) && (
                    <SideNavButton href='/admin'>Admin</SideNavButton>
                )}
            </ul>
        </Container>
    )
}

export default SideNav
