import { PropsWithChildren, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export type NavLinkItemProps = PropsWithChildren<{
    children: ReactNode
    to: string
}> &
    LinkProps

const NavLinkItem = ({ children, to, ...props }: NavLinkItemProps) => {
    return (
        <li>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default NavLinkItem
