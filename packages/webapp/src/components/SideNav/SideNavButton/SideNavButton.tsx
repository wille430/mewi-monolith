import { motion } from 'framer-motion'
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
import styles from './SideNavButton.module.scss'

const SideNavButton = ({
    children,
    ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    return (
        <motion.li
            className={styles.navItem}
            whileHover={{
                backgroundColor: 'lightgrey',
            }}
        >
            <a />
            <a {...rest}>{children}</a>
        </motion.li>
    )
}

export default SideNavButton
