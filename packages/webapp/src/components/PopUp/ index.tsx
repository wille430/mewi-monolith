import React, { ReactNode } from 'react'

interface PopUpProps {
    children: ReactNode
    show: boolean
    onOutsideClick: () => void
}

const PopUp = ({ children, show = true, onOutsideClick }: PopUpProps) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onOutsideClick && onOutsideClick()
        }
    }

    return (
        <div
            className='top-0 left-0 fixed w-screen h-screen bg-black bg-opacity-40 z-40 sm:p-4 overflow-y-scroll'
            onClick={handleClick}
            style={{
                display: show ? 'block' : 'none',
            }}
        >
            {children}
        </div>
    )
}

export default PopUp
