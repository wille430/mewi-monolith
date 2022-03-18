import { HTMLAttributes, useEffect, useState } from 'react'
import MewiLogo from '../MewiLogo/MewiLogo'
import { useHistory, useLocation } from 'react-router-dom'
import NavLinkItem from './NavLinkItem'
import LogOutButton from './LogOutButton'
import NavCurve from './NavCurve'
import { FiMenu } from 'react-icons/fi'
import SearchForm from 'components/SearchForm/SearchForm'
import { useAppSelector } from 'hooks/hooks'
import styles from './Nav.module.scss'
import classNames from 'classnames'
import { privateLinks, publicLinks } from './links'
import DrawerNav from './DrawerNav/DrawerNav'

const cx = classNames.bind(styles)

const Nav = () => {
    const location = useLocation()
    const history = useHistory()
    const path = location.pathname

    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {
        history.listen(() => {
            setShowMenu(false)
        })
    }, [history])

    return (
        <header
            className={cx({
                [styles.wrapper]: true,
            })}
        >
            <div
                className={cx({
                    [styles.container]: true,
                })}
            >
                {path !== '/' && (
                    <figure>
                        <MewiLogo />
                    </figure>
                )}

                <div
                    className={cx({
                        [styles.nav]: true,
                    })}
                >
                    <ul>
                        {publicLinks.map((link) => (
                            <NavLinkItem key={link.path} to={link.path}>{link.name}</NavLinkItem>
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

                {path !== '/' && <SearchForm />}

                <MenuButton
                    onClick={() => setShowMenu(!showMenu)}
                    className={cx({
                        [styles.menuButton]: true,
                    })}
                />

                <DrawerNav
                    className={cx({
                        [styles.drawer]: true,
                    })}
                    show={showMenu}
                >
                    {isLoggedIn && <LogOutButton />}
                </DrawerNav>
            </div>
            {path !== '/' && <NavCurve />}
        </header>
    )
}

const MenuButton = (props: HTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>
        <FiMenu color='white' size='32' />
    </button>
)

export default Nav
