import { HTMLAttributes, useEffect, useState } from 'react'
import MewiLogo from '../MewiLogo/MewiLogo'
import { Link, useHistory, useLocation } from 'react-router-dom'
import NavLinkItem from './NavLinkItem'
import LogOutButton from './LogOutButton'
import NavCurve from './NavCurve'
import { FiMenu } from 'react-icons/fi'
import SearchForm from 'components/SearchForm/SearchForm'
import { useAppSelector } from 'hooks/hooks'
import styles from './Nav.module.scss'
import classNames from 'classnames'
import links, { privateLinks, publicLinks } from './links'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'

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
                            <NavLinkItem to={link.path}>{link.name}</NavLinkItem>
                        ))}
                        <div className='flex-grow' />
                        {privateLinks.map((link) => (
                            <NavLinkItem to={link.path} className={link.styling}>
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

const DrawerNav = ({ children, show, ...props }: HTMLMotionProps<'ul'> & { show: boolean }) => {
    const drawerAnimation = {
        hidden: {
            height: '0',
            transition: {
                when: 'afterChildren',
                staggerChildren: 0.01,
                staggerDirection: -1,
                duration: 0.1,
            },
        },
        show: {
            height: 'auto',
        },
    }

    const linkAnimation = {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.1,
            },
        },
        show: {
            opacity: 1,
        },
    }

    const paddingAnimation = {
        animate: (active: boolean) => ({
            height: active ? '2rem' : '0rem',
            transition: {
                duration: 0.2,
            },
        }),
    }

    return (
        <div>
            <motion.div variants={paddingAnimation} animate='animate' custom={show} />
            <AnimatePresence>
                {show && (
                    <motion.ul
                        {...props}
                        variants={drawerAnimation}
                        initial='hidden'
                        animate='show'
                        exit={'hidden'}
                    >
                        {links.map((link) => (
                            <motion.li className={link.styling} variants={linkAnimation}>
                                <Link to={link.path}>{link.name}</Link>
                            </motion.li>
                        ))}
                        <motion.li variants={linkAnimation}>{children}</motion.li>
                    </motion.ul>
                )}
            </AnimatePresence>
            <motion.div variants={paddingAnimation} animate='animate' custom={show} />
        </div>
    )
}

export default Nav
