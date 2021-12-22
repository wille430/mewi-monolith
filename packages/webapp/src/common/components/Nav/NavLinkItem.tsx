import { PropsWithChildren, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type Props = PropsWithChildren<{
    children: ReactNode
    to: string
}> &
    LinkProps

const NavLinkItem = ({ children, to, ...props }: Props) => {
    return (
        <li>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default NavLinkItem
