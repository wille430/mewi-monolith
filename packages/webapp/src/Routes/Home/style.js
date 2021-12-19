import styled from "styled-components";
import theme from "themes/theme";

export const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    background-color: ${theme.bg};
    position: relative;
    z-index: 1;
`

export const Container = styled.div`
    background-color: ${theme.main3};
    min-height: 45vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
`

export const InnerContainer = styled.div`
    display: flex;
    min-width: 1200px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px 20px;

    @media (max-width: 1200px) {
        width: 100%;
        min-width: 100px;
    }
    @media (max-width: 1000px) {
        flex-direction: column;
        align-items: center;
        color: white;
    }
`
const searchContainerHeight = '275px'
export const SearchContainer = styled.div`
    height: ${searchContainerHeight};
    width: 550px;
    background-color: ${theme.searchContainerColor};
    color: white;
    padding: 30px 30px;
    border-radius: 20px;
    
    @media (max-width: 1000px) {
        background-color: transparent;
        height: auto;
        width: auto;
    }
`

export const SearchContainerWrapper = styled.div`
    position: relative;
`

export const SearchBarWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    color: black;
`

export const LogoWrapper = styled.div`
    height: 100%;
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
`
export const LogoInnerWrapper = styled.div`
    height: 180px;

    @media (max-width: 1000px){
        height: 125px;
    }
`