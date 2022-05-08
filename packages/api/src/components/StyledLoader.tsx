import * as Loader from 'react-loader-spinner'

const StyledLoader = () => {
    return (
        <Loader.TailSpin
            height='40px'
            width='40px'
            wrapperClass='color-secondary'
            data-testid='spinner'
        />
    )
}

export default StyledLoader
