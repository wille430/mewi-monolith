import { HTMLAttributes, useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import SlideTransition from '../SlideTransition'

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

const Snackbar = ({
    title,
    body,
    handleClose,
    open = true,
    autoHideDuration = 6000,
    animationDuration = 500,
    onExited,
}: SnackbarProps) => {
    const timerAutoHide = useRef<NodeJS.Timeout | null>()
    const shouldCloseSnackbar = useRef(false)
    const isInteractedWith = useRef(false)

    const closeSnackbar = () => {
        handleClose && handleClose()
    }

    const handleClick = () => closeSnackbar()

    const handleExited = () => onExited && onExited()

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

    useEffect(() => {
        setAutoHideTimeout()
    }, [])

    return (
        <SlideTransition
            runOnStart={!open}
            in={open}
            duration={animationDuration}
            onExited={handleExited}
            render={(state) => {
                return (
                    <div
                        style={{
                            width: 'clamp(20rem, 500px, 100%)',
                            minHeight: '2rem',
                        }}
                        className='z-100 z-50 flex cursor-pointer select-none flex-row justify-between rounded-md bg-white text-black shadow-lg'
                        data-testid='snackbarContainer'
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className='flex h-auto w-full flex-grow flex-col divide-y divide-blue-dark'>
                            <header className='flex-0 flex p-2 px-3'>
                                <h4 className='flex-grow' data-testid='snackbarTitle'>
                                    {title}
                                </h4>
                                <button data-testid='closeSnackbar' onClick={handleClick}>
                                    <FiX size='20' />
                                </button>
                            </header>

                            <p
                                className={`flex-grow break-words p-3 px-4 text-sm text-gray-500`}
                                style={{
                                    minHeight: '1.5rem',
                                }}
                                data-testid='snackbarText'
                            >
                                {body}
                            </p>
                        </div>
                    </div>
                )
            }}
        />
    )
}

export default Snackbar
