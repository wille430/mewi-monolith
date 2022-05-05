import { NavLink } from 'components/Nav/links'
import { motion } from 'framer-motion'
import { useAppSelector } from 'hooks/hooks'
import { ReactElement } from 'react'
import styles from './DrawerNavLink.module.scss'

const DrawerNavLinkItem = ({
    styling,
    path,
    name,
    sublinks,
    children,
}: NavLink & { children?: ReactElement | string }) => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

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

    return (
        <motion.li className={styling} variants={linkAnimation}>
            <a href={path}>{name}</a>{' '}
            <ul className={styles.list}>
                {sublinks?.map((link) => {
                    if (!link.private || (link.private && isLoggedIn)) {
                        return (
                            <DrawerNavLinkItem key={link.path} {...link}>
                                {link.name}
                            </DrawerNavLinkItem>
                        )
                    }
                })}
            </ul>
        </motion.li>
    )
}

export default DrawerNavLinkItem
