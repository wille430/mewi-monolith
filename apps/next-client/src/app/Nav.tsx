"use client"
// noinspection SuspiciousTypeOfGuard
import Link from 'next/link'
import {GiHamburgerMenu} from 'react-icons/gi'
import {useEffect, useMemo, useState} from 'react'
import type {Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'
import {useWindowSize} from '@/hooks/useWindowSize'
import {motion} from "framer-motion"
import styles from "./Nav.module.scss"
import {getUser, logout} from "@/store/user"
import {useAppDispatch, useAppSelector} from "@/hooks"
import clsx from "clsx"
import {Arc} from "@/components/Arc/Arc"

const hideLogoInRoutes = ['/']

export const navLinks = [
    {
        path: "/",
        label: "Hem",
    },
    {
        path: "#",
        label: "Om Oss",
    },
    {
        path: "/kategorier",
        label: "Kategorier",
    }
]

export const drawerVariants: Variants = {
    hidden: {
        height: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.01,
            staggerDirection: -1,
            duration: 0.1,
        },
    },
    show: {
        height: "auto",
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

export const Nav = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const size = useWindowSize()
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    const isDrawer = useMemo(() => size.width < 768, [size])
    const [showLogo, setShowLogo] = useState(!isDrawer || (isDrawer && !mobileOpen))

    const {isLoggedIn} = useAppSelector(state => state.user)

    useEffect(() => {
        setShowLogo(!isDrawer || (isDrawer && !mobileOpen))
    }, [isDrawer, mobileOpen])

    // fetch user status
    // DO NOT REMOVE
    const {isReady} = useAppSelector(state => state.user)
    useEffect(() => {
        if (!isReady) {
            dispatch(getUser())
        }
    }, [])

    return (
        <>
            <nav className="bg-primary text-white">
                <div className={styles["inner-nav"]}>
                    <motion.figure className="h-auto w-20" variants={logoVariants}
                                   animate={showLogo ? 'show' : 'hidden'}>
                        <Link href="/">
                            {!hideLogoInRoutes.includes(pathname ?? "/") && (
                                <img src="/img/logo.png" alt="Mewi logo"/>
                            )}
                        </Link>
                    </motion.figure>

                    <motion.ul variants={isDrawer ? drawerVariants : undefined}
                               animate={mobileOpen ? "show" : "hidden"}>
                        {navLinks.map(o => (
                            <motion.li key={o.path} className={styles["nav-link"]}
                                       variants={isDrawer ? linkVariants : undefined}>
                                <Link href={o.path}>{o.label}</Link>
                            </motion.li>
                        ))}

                        <motion.li className={clsx(styles["logout-btn"], styles["nav-link"])}
                                   variants={isDrawer ? linkVariants : undefined}>

                            {isLoggedIn ? (
                                <button aria-label="Logga ut" onClick={() => dispatch(logout())}>Logga ut</button>
                            ) : (
                                <Link href="/loggain">Logga in</Link>
                            )}
                        </motion.li>
                    </motion.ul>

                    <button className={styles["menu-toggle"]} onClick={() => setMobileOpen((prev) => !prev)}>
                        <GiHamburgerMenu size={32}/>
                    </button>
                </div>
            </nav>

            {!hideLogoInRoutes.includes(pathname ?? "/") && (
                <Arc/>
            )}
        </>
    )
}
