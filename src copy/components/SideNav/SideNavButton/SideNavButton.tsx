import { motion } from 'framer-motion'
import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
import styles from './SideNavButton.module.scss'

const SideNavButton = ({
    children,
    ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    return (
        <motion.li className={styles.navItem}>
            <a {...rest}>{children}</a>
        </motion.li>
    )
}

export default SideNavButton
