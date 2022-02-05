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
        <div className='mx-4 hidden flex-1 md:col-start-2 md:col-end-5 md:block'>
            <ul
                className='mx-auto flex flex-row space-x-4 rounded-full bg-white p-2.5 px-4 text-sm text-black'
                style={{
                    maxWidth: '600px',
                }}
            >
                {children}
            </ul>
        </div>
    ) : show ? (
        <div className='fixed top-0 left-0 z-40 flex h-screen w-full flex-col bg-blue text-white'>
            <header className='p-4'>
                <button onClick={(e) => closeMenu()}>
                    <FiArrowLeft size='24' />
                </button>
            </header>
            <div className='flex flex-grow items-center justify-center'>
                <ul className='space-y-4'>{children}</ul>
            </div>
            <div className='h-1/4'></div>
        </div>
    ) : (
        <></>
    )
}

export default InnerNav
