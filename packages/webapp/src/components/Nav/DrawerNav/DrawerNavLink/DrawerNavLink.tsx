import { NavLink } from 'components/Nav/links'
import { motion } from 'framer-motion'
import { useAppSelector } from 'hooks/hooks'
import { Link } from 'react-router-dom'
import styles from './DrawerNavLink.module.scss'

const DrawerNavLinkItem = ({ styling, path, name, sublinks }: NavLink) => {
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
            <Link to={path}>{name}</Link>{' '}
            <ul className={styles.list}>
                {sublinks?.map((link) => {
                    if (!link.private || (link.private && isLoggedIn)) {
                        return <DrawerNavLinkItem {...link}>{link.name}</DrawerNavLinkItem>
                    }
                })}
            </ul>
        </motion.li>
    )
}

export default DrawerNavLinkItem
