import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'

interface PopUpProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    show: boolean
    onOutsideClick?: () => void
}

const PopUp = ({ children, show = true, onOutsideClick, className, ...rest }: PopUpProps) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onOutsideClick && onOutsideClick()
        }
    }

    const fadeVariant = {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
        },
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    {...rest}
                    className={classNames({
                        'fixed top-0 left-0 z-40 h-screen w-screen overflow-y-scroll bg-black bg-opacity-40 p-4':
                            true,
                        [className || '']: !!className,
                    })}
                    onClick={handleClick}
                    variants={fadeVariant}
                    initial='hidden'
                    animate='show'
                    exit='hidden'
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PopUp
