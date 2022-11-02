import type { ReactNode } from 'react'
import style from './Layout.module.scss'
import { Nav } from '../Nav/Nav'
import { Footer } from '../Footer/Footer'
import { Arch } from '../Arch/Arch'

interface LayoutProps {
    children: ReactNode
    decorations?: boolean
}

export const Layout = ({ children, decorations = true }: LayoutProps) => {
    return (
        <div className='flex min-h-screen flex-col justify-between'>
            <div
                className='flex flex-col'
                style={{
                    minHeight: 'calc(100vh - 4rem)',
                }}
            >
                <header className={style.header}>
                    <Nav />
                </header>
                {decorations && <Arch className='pb-2' />}
                <div className='flex-grow'>{children}</div>
            </div>
            <Footer />
        </div>
    )
}
