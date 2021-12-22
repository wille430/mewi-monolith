import { useWindowWidth } from '@react-hook/window-size'
import styled from 'styled-components'

const SmallWaves = () => {
    const windowWidth = useWindowWidth()

    const ShapeDividerTop = styled.div`
        position: absolute;
        top: 45vh;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: -1;
    `
    const Svg = styled.svg`
        position: relative;
        display: block;
        width: calc(252% + 1.3px);
        height: ${(161 * windowWidth) / 2000 + 35}px;
        transform: rotateY(170deg);
    `

    const Path = styled.path`
        /* fill: red; */
    `

    return (
        <ShapeDividerTop>
            <Svg
                data-name='Layer 1'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 1200 120'
                preserveAspectRatio='none'
            >
                <defs>
                    <linearGradient
                        id='grad1'
                        gradientTransform='rotate(90)'
                        x1='0%'
                        y1='0%'
                        x2='100%'
                        y2='0%'
                    >
                        <stop
                            offset='0%'
                            style={{
                                stopColor: '#4158D0',
                                stopOpacity: 1,
                            }}
                        />
                        <stop
                            offset='50%'
                            style={{
                                stopColor: '#C850C0',
                                stopOpacity: 1,
                            }}
                        />
                        <stop
                            offset='100%'
                            style={{
                                stopColor: '#FFCC70',
                                stopOpacity: 1,
                            }}
                        />
                    </linearGradient>
                </defs>
                <Path
                    d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
                    fill='url(#grad1)'
                ></Path>
            </Svg>
        </ShapeDividerTop>
    )
}

export default SmallWaves
