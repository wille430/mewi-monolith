import * as Loader from 'react-loader-spinner'
import theme from 'themes/theme'

const StyledLoader = () => {
    return <Loader.TailSpin height='40px' width='40px' color={theme.accent1} data-testid='spinner' />
}

export default StyledLoader
