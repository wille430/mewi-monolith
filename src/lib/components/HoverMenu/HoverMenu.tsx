import clsx from 'clsx'
import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import styles from './HoverMenu.module.scss'

export type HoverMenuProps = HTMLMotionProps<'ul'>

export const HoverMenu = ({ children, className, ...props }: HoverMenuProps) => {
    return (
        <div
            className={clsx({
                [styles.menu]: true,
                [className ?? '']: Boolean(className),
            })}
        >
            <div className={styles['arrow-up']} />
            <motion.ul className={styles['menu-content']} {...props}>
                {children}
            </motion.ul>
        </div>
    )
}
