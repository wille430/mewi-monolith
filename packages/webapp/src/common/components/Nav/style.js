import { Link } from 'react-router-dom'
import styled from 'styled-components'
import theme, { dimensions } from '../../themes/theme'

export const NavContainer = styled.div`
    height: ${dimensions.navBarHeight};
    width: 100%;
    /* background-color: ${theme.accent1} */
    background-color: ${(props) => props.color || theme.main3};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (max-width: 550px) {
        height: auto;
    }
`

export const InnerNav = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr auto;

    @media (max-width: 550px) {
        grid-template-columns: 1fr;
        grid-auto-rows: 1fr;
    }
`

export const SearchBarContainer = styled.div`
    margin: auto;
`
export const RightNav = styled.div`
    display: flex;
    justify-content: flex-end;
`

export const LeftNav = styled(RightNav)`
    justify-content: flex-start;
`

export const MiddleNav = styled.div`
    height: 100%;
`

export const NavLinkListContainer = styled.div`
    height: 50px;
    background-color: transparent;
    border-radius: 20px;
    padding: 0px 20px;
`

export const NavLinkList = styled.ul`
    height: 100%;
    min-width: 400px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 600px) {
        width: 100%;
        min-width: 100px;
    }
`

export const NavLinkItem = styled(Link)`
    list-style: none;
    font-size: 0.875em;
    font-weight: 600;
    float: ${(props) => props.float || 'left'};
    margin: auto 15px;
    text-decoration: none;
`

export const NavLinkButton = styled.button`
    list-style: none;
    font-size: 0.875em;
    font-weight: 600;
    float: ${(props) => props.float || 'left'};
    margin: auto 15px;
    text-decoration: none;
`
