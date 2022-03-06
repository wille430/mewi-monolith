import StyledLoader from 'components/StyledLoader'

const LazyLoader = () => {
    return (
        <div
            className='flex items-center justify-center'
            style={{
                height: 'calc(100vh - 20rem)',
            }}
        >
            <StyledLoader />
        </div>
    )
}

export default LazyLoader
