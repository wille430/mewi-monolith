import React, { useContext, useState } from 'react'
import MewiLogo from '../MewiLogo/index'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'common/context/UserContext'
import NavLinkItem from './NavLinkItem'
import LogOutButton from './LogOutButton'
import NavCurve from './NavCurve'
import { FiMenu } from 'react-icons/fi'
import InnerNav from './InnerNav'
import SearchForm from 'common/components/SearchForm';

const Nav = () => {
    const location = useLocation()
    const path = location.pathname

    const { token } = useContext(UserContext)
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className="relative">
            <div className="flex justify-between w-full bg-blue items-center p-3 shadow-lg space-x-2">
                {path !== "/" && <figure className="h-10 flex-none"><MewiLogo /></figure>}
                {/* Inner nav */}
                <InnerNav show={showMenu} closeMenu={() => setShowMenu(false)}>
                    <NavLinkItem to="/">Hem</NavLinkItem>
                    {/* <NavLinkItem to="/search">Produkter</NavLinkItem> */}
                    <NavLinkItem to="#">Om Oss</NavLinkItem>
                    <NavLinkItem to="/kategorier">Alla Kategorier</NavLinkItem>
                    <div className="flex-grow" />
                    <NavLinkItem to="/minabevakningar" className="text-green-dark">Mina Bevakningar</NavLinkItem>
                    {token && <LogOutButton />}
                </InnerNav>
                {path !== "/" && <div className="flex justify-end w-64 flex-grow md:flex-none max-w-xs">
                    <SearchForm size="small"/>
                </div>}
                <button className="block md:hidden" onClick={e => setShowMenu(!showMenu)}>
                    <FiMenu color="white" size="32" />
                </button>
            </div>
            {path !== "/" && <NavCurve />}
        </div>
    )
}

export default Nav