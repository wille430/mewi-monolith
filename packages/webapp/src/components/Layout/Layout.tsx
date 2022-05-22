import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import style from './Layout.module.scss'
import Nav from '../Nav/Nav'
import NavCurve from '../Nav/NavCurve'

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
                    <a className={style.logo} href='/'>
                        {!routesToNotShowLogo.includes(router.pathname) && (
                            <img src='/img/logo.png' alt='Mewi logo' />
                        )}
                    </a>
                    <Nav />
                </div>
            </header>
            {decorations && <NavCurve />}
            <div className='flex-grow'>{children}</div>
        </div>
    )
}
