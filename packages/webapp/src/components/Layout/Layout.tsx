import { ReactNode } from 'react'
import Nav from '../Nav/Nav'
import style from './Layout.module.scss'

interface LayoutProps {
    children: ReactNode
    decorations?: boolean
}

export const Layout = ({ children, decorations }: LayoutProps) => {
    return (
        <>
            <header className={style.header}>
                <Nav />
            </header>
            {decorations && <div>deco</div>}
            <main>{children}</main>
        </>
    )
}
