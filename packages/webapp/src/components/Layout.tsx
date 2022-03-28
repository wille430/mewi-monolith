import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    ads?: boolean
}

const Layout = ({ children, ads = false }: Props) => <div className='layout'>{children}</div>

export default Layout
