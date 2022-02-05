const Waves = () => {
    return (
        <div
            className='relative'
            style={{
                height: 'calc((15vw + 20vh) / 2)',
            }}
        >
            <svg
                className='absolute'
                viewBox='0 0 100 100'
                height='100%'
                width='100%'
                preserveAspectRatio='none'
            >
                <path
                    fill='url(#grad1)'
                    vectorEffect='non-scaling-stroke'
                    d='M0 55 Q25 100, 53 55 Q80 10, 100 35 V0 H0'
                />
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
            </svg>
            <svg
                className='absolute'
                viewBox='0 0 100 100'
                height='100%'
                width='100%'
                preserveAspectRatio='none'
            >
                <path
                    className='fill-primary'
                    vectorEffect='non-scaling-stroke'
                    d='M0 55 Q25 100, 50 35 Q65 0, 80 22 Q90 35, 100 35 V0 H0'
                />
            </svg>
        </div>
    )
}

export default Waves
