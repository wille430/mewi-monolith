import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import Nav from '../Nav/Nav'
import NavCurve from '../Nav/NavCurve'
import style from './Layout.module.scss'

interface LayoutProps {
    children: ReactNode
    decorations?: boolean
}

const routesToNotShowLogo = ['/']

export const Layout = ({ children, decorations = true }: LayoutProps) => {
    const router = useRouter()

    return (
        <div className='h-screen flex flex-col'>
            <header className={style.header}>
                <div className={style.innerHeader}>
                    <div className={style.logo}>
                        {!routesToNotShowLogo.includes(router.pathname) && (
                            <img src='/img/logo.png' alt='Mewi logo' />
                        )}
                    </div>
                    <Nav />
                </div>
            </header>
            {decorations && <NavCurve />}
            <main className='flex-grow'>{children}</main>
        </div>
    )
}
