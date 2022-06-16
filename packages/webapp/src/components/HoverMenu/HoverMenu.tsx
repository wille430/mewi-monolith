import classNames from 'classnames'
import { motion, HTMLMotionProps } from 'framer-motion'
import styles from './HoverMenu.module.scss'

export type HoverMenuProps = HTMLMotionProps<'ul'>

export const HoverMenu = ({ children, className, ...props }: HoverMenuProps) => {
    return (
        <div
            className={classNames({
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
