import style from './DecorativeWaves.module.scss'

export const DecorativeWaves = () => (
    <div className={style.wrapper}>
        <svg
            className={style.svg}
            viewBox='0 0 100 100'
            height='100%'
            width='100%'
            preserveAspectRatio='none'
        >
            <path
                fill='url(#grad1)'
                id={style.p1}
                vectorEffect='non-scaling-stroke'
                d='M0 55 Q25 100, 53 55 Q80 10, 100 35 V0 H0'
            />
            <defs>
                <linearGradient
                    id={style.grad1}
                    gradientTransform='rotate(90)'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='0%'
                >
                    <stop className={style.stop} offset='0%' id={style.s1} />
                    <stop className={style.stop} offset='50%' id={style.s2} />
                    <stop className={style.stop} offset='100%' id={style.s3} />
                </linearGradient>
            </defs>
        </svg>
        <svg
            className={style.svg}
            viewBox='0 0 100 100'
            height='100%'
            width='100%'
            preserveAspectRatio='none'
        >
            <path
                id={style.p2}
                vectorEffect='non-scaling-stroke'
                d='M0 55 Q25 100, 50 35 Q65 0, 80 22 Q90 35, 100 35 V0 H0'
            />
        </svg>
    </div>
)
