const NavCurve = () => {
    return (
        <div className='pb-24'>
            <svg
                className='w-full fill-primary'
                style={{
                    height: '1.8vw',
                }}
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
            >
                <path vectorEffect='non-scaling-stroke' d='M0 0 Q50 100, 100 0' />
            </svg>
        </div>
    )
}

export default NavCurve
