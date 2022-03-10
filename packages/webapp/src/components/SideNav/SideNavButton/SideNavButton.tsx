import { motion } from 'framer-motion'
import { Link, LinkProps } from 'react-router-dom'
import styles from './SideNavButton.module.scss'

const SideNavButton = ({ children, ...rest }: LinkProps) => {
    return (
        <motion.li
            className={styles.navItem}
            whileHover={{
                backgroundColor: 'lightgrey',
            }}
        >
            <Link {...rest}>{children}</Link>
        </motion.li>
    )
}

export default SideNavButton
