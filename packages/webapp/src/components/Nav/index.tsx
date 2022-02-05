import { useState } from 'react'
import MewiLogo from '../MewiLogo/index'
import { useLocation } from 'react-router-dom'
import NavLinkItem from './NavLinkItem'
import LogOutButton from './LogOutButton'
import NavCurve from './NavCurve'
import { FiMenu } from 'react-icons/fi'
import InnerNav from './InnerNav'
import SearchForm from 'components/SearchForm'
import { useAppSelector } from 'hooks/hooks'

const Nav = () => {
    const location = useLocation()
    const path = location.pathname

    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className='relative'>
            <div className='flex w-full items-center justify-between space-x-2 bg-blue p-3'>
                {path !== '/' && (
                    <figure className='h-10 flex-none'>
                        <MewiLogo />
                    </figure>
                )}
                {/* Inner nav */}
                <InnerNav show={showMenu} closeMenu={() => setShowMenu(false)}>
                    <NavLinkItem to='/'>Hem</NavLinkItem>
                    {/* <NavLinkItem to="/search">Produkter</NavLinkItem> */}
                    <NavLinkItem to='#'>Om Oss</NavLinkItem>
                    <NavLinkItem to='/kategorier'>Alla Kategorier</NavLinkItem>
                    <div className='flex-grow' />
                    <NavLinkItem to='/minabevakningar' className='text-green-dark'>
                        Mina Bevakningar
                    </NavLinkItem>
                    {isLoggedIn && <LogOutButton />}
                </InnerNav>
                {path !== '/' && (
                    <div className='flex w-64 max-w-xs flex-grow justify-end md:flex-none'>
                        <SearchForm size='small' />
                    </div>
                )}
                <button className='block md:hidden' onClick={(e) => setShowMenu(!showMenu)}>
                    <FiMenu color='white' size='32' />
                </button>
            </div>
            {path !== '/' && <NavCurve />}
        </div>
    )
}

export default Nav
