import React from 'react'

const PopUp = ({ children, show = true, onOutsideClick }) => {
    return (
        <div
            className='top-0 left-0 fixed w-screen h-screen bg-black bg-opacity-40 z-40 sm:p-4 overflow-y-scroll'
            onClick={onOutsideClick}
            style={{
                display: show ? 'block' : 'none',
            }}
        >
            {children}
        </div>
    )
}

export default PopUp
