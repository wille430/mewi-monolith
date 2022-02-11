import styles from './index.module.scss'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const cx = classNames.bind(styles)

interface DrawerAnimationProps {
    open: boolean
    children: ReactNode
}

const DrawerAnimation = ({ open, children }: DrawerAnimationProps) => {
    const drawerVariants = {
        show: {
            height: 0,
        },
        hidden: {
            height: 'auto',
        },
    }

    return (
        <motion.div
            className={cx({
                [styles.container]: true,
            })}
            variants={drawerVariants}
            animate={open ? 'show' : 'hidden'}
        >
            {children}
        </motion.div>
    )
}

export default DrawerAnimation
