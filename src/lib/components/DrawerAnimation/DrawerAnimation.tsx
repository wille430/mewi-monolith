import clsx from 'clsx'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import styles from './DrawerAnimation.module.scss'

interface DrawerAnimationProps {
    open: boolean
    children: ReactNode
}

const DrawerAnimation = ({ open, children }: DrawerAnimationProps) => {
    const drawerVariants = {
        show: {
            height: 'auto',
        },
        hidden: {
            height: 0,
        },
    }

    return (
        <motion.div
            className={clsx({
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
