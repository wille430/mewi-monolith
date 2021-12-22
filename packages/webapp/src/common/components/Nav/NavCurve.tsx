import { useWindowWidth } from '@react-hook/window-size'
import theme from 'themes/theme'

const NavCurve = () => {
    const windowWidth = useWindowWidth()

    const svgHeight = (windowWidth ** 0.5 / 1980) * 10 * 15
    const startPoint = [0, 0]
    const controlPoint = [50, (svgHeight * 15) / 28]
    const endPoint = [100, 0]

    const svgPath = (
        <path
            d={`
      M ${startPoint}
      Q ${controlPoint} ${endPoint}
    `}
            fill={theme.main3}
            stroke={theme.main3}
            strokeWidth={2}
        />
    )

    return (
        <div className='pb-24'>
            <svg
                className='w-full'
                viewBox={`0 0 100 2`}
                style={{ maxHeight: 400 }}
                preserveAspectRatio='none'
            >
                {svgPath}
            </svg>
        </div>
    )
}

export default NavCurve
