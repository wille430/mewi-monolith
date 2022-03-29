import * as Loader from 'react-loader-spinner'
import tailwindConfig from 'themes/tailwindConfig'

const StyledLoader = () => {
    return (
        <Loader.TailSpin
            height='40px'
            width='40px'
            color={tailwindConfig.theme.colors['secondary']}
            data-testid='spinner'
        />
    )
}

export default StyledLoader
