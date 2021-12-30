import { ReactNode, useEffect } from 'react'
import { useWindowWidth } from '@react-hook/window-size'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router'

const InnerNav = ({
    children,
    show = false,
    closeMenu,
}: {
    children: ReactNode
    show: boolean
    closeMenu: () => void
}) => {
    const width = useWindowWidth()
    const history = useHistory()

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [show])

    useEffect(() => {
        history.listen((location) => {
            closeMenu()
        })
        // eslint-disable-next-line
    }, [history])

    return width > 768 ? (
        <div className='md:col-start-2 md:col-end-5 hidden md:block flex-1 mx-4'>
            <ul
                className='flex flex-row bg-white rounded-full text-black p-2.5 px-4 mx-auto space-x-4 text-sm'
                style={{
                    maxWidth: '600px',
                }}
            >
                {children}
            </ul>
        </div>
    ) : show ? (
        <div className='top-0 left-0 bg-blue text-white w-full h-screen fixed z-40 flex flex-col'>
            <header className='p-4'>
                <button onClick={(e) => closeMenu()}>
                    <FiArrowLeft size='24' />
                </button>
            </header>
            <div className='flex justify-center items-center flex-grow'>
                <ul className='space-y-4'>{children}</ul>
            </div>
            <div className='h-1/4'></div>
        </div>
    ) : (
        <></>
    )
}

export default InnerNav
