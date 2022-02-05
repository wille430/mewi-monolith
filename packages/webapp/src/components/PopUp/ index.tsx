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
            className='fixed top-0 left-0 z-40 h-screen w-screen overflow-y-scroll bg-black bg-opacity-40 sm:p-4'
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
