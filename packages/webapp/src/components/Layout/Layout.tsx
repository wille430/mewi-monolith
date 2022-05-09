import { ReactNode } from 'react'
import Nav from '../Nav/Nav'
import style from './Layout.module.scss'

interface LayoutProps {
    children: ReactNode
    decorations?: boolean
}

export const Layout = ({ children, decorations = true }: LayoutProps) => {
    return (
        <div className='h-screen flex flex-col'>
            <header className={style.header}>
                <Nav />
            </header>
            {decorations && <div>deco</div>}
            <main className='flex-grow'>{children}</main>
        </div>
    )
}