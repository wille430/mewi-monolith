import { useWindowWidth } from "@react-hook/window-size"
import styled from "styled-components"
import theme from "themes/theme"

const BigWaves = () => {

    const windowWidth = useWindowWidth()

    const ShapeDividerTop = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: 1;
        height: 200px;
    `
    const Svg = styled.svg`
        position: relative;
        display: block;
        width: calc(149% + 1.3px);
        height: ${161*windowWidth/2000+40}px;
        transform: rotateY(180deg);
        filter: drop-shadow(0px -10px 20px black);
    `

    const Wrapper = styled.div`
        position: relative;
    `

    const Path = styled.path`
        fill: ${theme.main3};
    `

    return (
        <Wrapper>
            <ShapeDividerTop>
                <Svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <Path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></Path>
                </Svg>
            </ShapeDividerTop>
        </Wrapper>
    )
}

export default BigWaves