import { AnchorHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

export type NavLinkItemProps = PropsWithChildren<{
    children: ReactNode
    to: string
}> &
    AnchorHTMLAttributes<HTMLAnchorElement>

const NavLinkItem = ({ children, to, ...props }: NavLinkItemProps) => {
    return (
        <li>
            <a href={to} {...props}>
                {children}
            </a>
        </li>
    )
}

export default NavLinkItem
