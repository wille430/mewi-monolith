import { motion, Variants } from 'framer-motion'
import { HTMLAttributes, useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import classNames from 'classnames'
import styles from './Snackbar.module.scss'

const cx = classNames.bind(styles)

export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
    title?: string
    body?: string
    autoHideDuration?: number
    handleClose?: () => void
    open?: boolean
    animationDuration?: number
    onExited?: () => void
    type?: 'error' | 'info'
}

const Snackbar = ({ title, body, handleClose, autoHideDuration = 6000, type }: SnackbarProps) => {
    const timerAutoHide = useRef<NodeJS.Timeout | null>()
    const shouldCloseSnackbar = useRef(false)
    const isInteractedWith = useRef(false)

    const closeSnackbar = () => {
        handleClose && handleClose()
    }

    const handleClick = () => closeSnackbar()

    const handleMouseEnter = () => {
        isInteractedWith.current = true
    }

    const handleMouseLeave = () => {
        isInteractedWith.current = false
        if (shouldCloseSnackbar.current) {
            closeSnackbar()
        }
    }

    const setAutoHideTimeout = () => {
        if (autoHideDuration == null) {
            return
        }

        if (timerAutoHide.current) {
            clearTimeout(timerAutoHide.current)
        }

        timerAutoHide.current = setTimeout(() => {
            if (!isInteractedWith.current) {
                closeSnackbar()
            } else {
                shouldCloseSnackbar.current = true
            }
        }, autoHideDuration)
    }

    const snackbarVariants: Variants = {
        hidden: {
            x: '-120%',
        },
        show: {
            x: type === 'error' ? [-75, 75, -45, 45, -15, 15, 0] : 0,
        },
    }

    useEffect(() => {
        setAutoHideTimeout()
    }, [])

    return (
        <motion.div
            className={cx({
                [styles.snackbar]: true,
                [styles.small]: !body,
                [styles.error]: type === 'error',
            })}
            data-testid='snackbarContainer'
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variants={snackbarVariants}
            initial={'hidden'}
            animate={'show'}
            exit={'hidden'}
            transition={{ type: 'spring', damping: 18, stiffness: 90 }}
        >
            <header className={styles.header}>
                <h4 className='flex-grow' data-testid='snackbarTitle'>
                    {title}
                </h4>
                <button data-testid='closeSnackbar' onClick={handleClick}>
                    <FiX size='20' />
                </button>
            </header>

            {body && (
                <p
                    className={cx({
                        [styles.bodyText]: true,
                    })}
                    data-testid='snackbarText'
                >
                    {body}
                </p>
            )}
        </motion.div>
    )
}

export default Snackbar
