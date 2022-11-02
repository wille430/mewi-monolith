import Link from 'next/link'
import clsx from 'clsx'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import type { NavLink } from './links'
import { links } from './links'
import styles from './Nav.module.scss'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useWindowSize } from '@/lib/hooks/useWindowSize'
import { logout } from '@/lib/store/user'

export const drawerVariants: Variants = {
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

const linkVariants = {
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

const logoVariants: Variants = {
    hidden: {
        display: 'none',
        opacity: 0,
    },
    show: {
        display: 'block',
        opacity: 1,
        transition: {
            delay: 0.2,
            duration: 0.25,
        },
    },
}

const hideLogoInRoutes = ['/']

export const Nav = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const size = useWindowSize()
    const router = useRouter()

    const isDrawer = size.width < 768
    const [showLogo, setShowLogo] = useState(!isDrawer || (isDrawer && !mobileOpen))

    const [expandedLink, setExpandedLink] = useState<number | null>()

    useEffect(() => {
        setShowLogo(!isDrawer || (isDrawer && !mobileOpen))
    }, [isDrawer, mobileOpen])

    return (
        <nav className={styles.nav}>
            <motion.a
                variants={logoVariants}
                animate={showLogo ? 'show' : 'hidden'}
                className={styles.logo}
                href='/'
            >
                {!hideLogoInRoutes.includes(router.pathname) && (
                    <img src='/img/logo.png' alt='Mewi logo' />
                )}
            </motion.a>

            <motion.ul
                variants={isDrawer ? drawerVariants : undefined}
                animate={mobileOpen ? 'show' : 'hidden'}
                aria-hidden={mobileOpen}
                className={styles['link-list']}
            >
                {links.map((props, i) => (
                    <NavListLink
                        key={i}
                        variants={isDrawer ? linkVariants : undefined}
                        onExpand={() => {
                            setExpandedLink((prev) => (prev === i ? null : i))
                        }}
                        expand={expandedLink === i}
                        {...props}
                    />
                ))}
            </motion.ul>

            <button
                className={styles['menu-toggle']}
                onClick={() => setMobileOpen((prev) => !prev)}
            >
                <GiHamburgerMenu size={32} />
            </button>
        </nav>
    )
}

export const NavListLink = ({
    label,
    condition,
    sublinks,
    className,
    variants,
    onExpand,
    expand,
    ...rest
}: NavLink & { variants?: Variants; onExpand?: () => any; expand?: boolean }) => {
    const state = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const router = useRouter()

    let shouldRender = true

    if (condition) {
        if (typeof condition === 'boolean') {
            shouldRender = condition
        } else {
            shouldRender = condition(state)
        }
    }

    if (!shouldRender) return null

    const handleExpand = () => {
        onExpand && onExpand()
    }

    return (
        <motion.li
            className={clsx(styles.link, className)}
            variants={variants}
            data-expand={expand}
        >
            <div>
                <Link {...rest}>{label}</Link>
                {sublinks && sublinks.length > 0 && (
                    <button className={styles['expand-button']} onClick={handleExpand}>
                        {expand ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                )}
            </div>
            {sublinks && (
                <div className={styles['sublinks-list']}>
                    <ul>
                        {sublinks.map((link, i) => (
                            <NavListLink key={i} {...link} />
                        ))}
                        {label === 'Mina Sidor' && (
                            <button
                                className={styles.link}
                                onClick={() =>
                                    dispatch(logout()).then(() => router.push('/loggain'))
                                }
                            >
                                Logga ut
                            </button>
                        )}
                    </ul>
                </div>
            )}
        </motion.li>
    )
}
