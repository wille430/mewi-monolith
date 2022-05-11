import { HTMLAttributes, useState } from 'react'
import NavLinkItem from './NavLinkItem'
import LogOutButton from './LogOutButton'
import { FiMenu } from 'react-icons/fi'
import styles from './Nav.module.scss'
import { privateLinks, publicLinks } from './links'
import DrawerNav from './DrawerNav/DrawerNav'
import { useAppSelector } from '@/hooks'

const Nav = () => {
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const [showMenu, setShowMenu] = useState(false)

    return (
        <>
            <div className={styles.nav}>
                <ul>
                    {publicLinks.map((link) => (
                        <NavLinkItem key={link.path} to={link.path}>
                            {link.name}
                        </NavLinkItem>
                    ))}
                    <div className='flex-grow' />
                    {privateLinks.map((link) => (
                        <NavLinkItem key={link.path} to={link.path} className={link.styling}>
                            {link.name}
                        </NavLinkItem>
                    ))}
                    {isLoggedIn && <LogOutButton />}
                </ul>
            </div>

            <MenuButton onClick={() => setShowMenu(!showMenu)} className={styles.menuButton} />

            <DrawerNav className={styles.drawer} show={showMenu}>
                {isLoggedIn && <LogOutButton />}
            </DrawerNav>
        </>
    )
}

const MenuButton = (props: HTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>
        <FiMenu color='white' size='32' />
    </button>
)

export default Nav
