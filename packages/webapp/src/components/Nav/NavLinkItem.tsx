import { AnchorHTMLAttributes, PropsWithChildren, ReactNode, useMemo } from 'react'
import { NavLink } from './links'
import styles from './NavLinkItem.module.scss'
import { HoverMenu } from '../HoverMenu/HoverMenu'
import { useAppSelector } from '@/hooks'

export type NavLinkItemProps = PropsWithChildren<{
    children: ReactNode
    to: string
    sublinks?: NavLink['sublinks']
}> &
    AnchorHTMLAttributes<HTMLAnchorElement>

const NavLinkItem = ({ children, to, sublinks, ...props }: NavLinkItemProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const _sublinks = useMemo(() => {
        if (isLoggedIn) {
            return sublinks
        } else {
            return sublinks?.filter((x) => !x.private)
        }
    }, [isLoggedIn])

    return (
        <li className={styles.link}>
            <a href={to} {...props}>
                {children}
            </a>
            {_sublinks?.length ? (
                <HoverMenu className={styles.menu}>
                    {_sublinks.map((link) => (
                        <NavLinkItem key={link.path} to={link.path} sublinks={link.sublinks}>
                            {link.name}
                        </NavLinkItem>
                    ))}
                </HoverMenu>
            ) : null}
        </li>
    )
}

export default NavLinkItem
