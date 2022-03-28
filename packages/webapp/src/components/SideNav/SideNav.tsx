import { Container } from '@mewi/ui'
import styles from './SideNav.module.scss'
import SideNavButton from './SideNavButton/SideNavButton'

const SideNav = () => {
    return (
        <Container className={styles.container}>
            <h4>Mina Sidor</h4>

            <ul>
                <SideNavButton to='/minabevakningar'>Mina Bevakningar</SideNavButton>
                <SideNavButton to='/mittkonto'>Mitt Konto</SideNavButton>
            </ul>
        </Container>
    )
}

export default SideNav
