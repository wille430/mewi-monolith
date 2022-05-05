import * as Loader from 'react-loader-spinner'
import { TailwindThemeColors } from 'tailwindcss/tailwind-config'
import tailwindConfig from 'themes/tailwindConfig'

const StyledLoader = () => {
    return (
        <Loader.TailSpin
            height='40px'
            width='40px'
            color={
                tailwindConfig.theme.colors &&
                tailwindConfig.theme.colors['secondary' as keyof TailwindThemeColors]
            }
            data-testid='spinner'
        />
    )
}

export default StyledLoader
