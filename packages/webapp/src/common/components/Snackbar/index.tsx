import _ from 'lodash'
import { HTMLAttributes, useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { TransitionStatus } from 'react-transition-group'
import SlideTransition from '../SlideTransition'

export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
    title?: string
    body?: string
    timeout?: number
    onClose?: () => void
    onDelete?: () => void
    open?: boolean
    animationDuration?: number
}

const Snackbar = ({
    title,
    body,
    timeout = 5000,
    onClose,
    onDelete,
    open = true,
    animationDuration = 500,
    ...rest
}: SnackbarProps) => {
    const [priorEvent, setPriorEvent] = useState<TransitionStatus | undefined>()
    const [show, setShow] = useState(false)

    const close = () => {
        onClose && onClose()
    }

    const handleClick = () => {
        console.log('Closing snackbox with close button...')
        close()
    }

    useEffect(() => {
        setShow(open)
        setTimeout(() => {
            console.log('Timed out. Exiting transition...')
            close()
        }, timeout)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setShow(open)
    }, [open])

    return (
        <SlideTransition
            in={show}
            duration={animationDuration}
            render={(state) => {
                if (state === 'exited' && priorEvent !== undefined && priorEvent === 'exiting') {
                    setTimeout(() => {
                        onDelete && onDelete()
                    }, animationDuration)
                } else if (state !== 'exited') {
                    setPriorEvent(state)
                }

                return (
                    <div
                        style={{
                            width: 'clamp(20rem, 50vw, 100%)',
                            minHeight: '2rem',
                        }}
                        className='flex flex-row z-50 rounded-md bg-blue z-100 text-white justify-between shadow-lg cursor-pointer select-none'
                        data-testid='snackbarContainer'
                        onClick={handleClick}
                    >
                        <div className='flex flex-col flex-grow divide-y divide-blue-dark h-auto w-full'>
                            <header className='flex-0 flex p-2 px-3'>
                                <h3 className='flex-grow' data-testid='snackbarTitle'>
                                    {title}
                                </h3>
                                <button data-testid='closeSnackbar' onClick={handleClick}>
                                    <FiX size='20' />
                                </button>
                            </header>

                            <p
                                className={`flex-grow text-sm break-words p-3 px-4 text-gray-100`}
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
