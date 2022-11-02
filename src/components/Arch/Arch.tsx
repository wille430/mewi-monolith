import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export const Arch = ({ className, ...props }: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg
        className={clsx('w-full fill-primary', className)}
        style={{
            height: 'max(1.8vw, 1rem)',
        }}
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
        {...props}
    >
        <path vectorEffect='non-scaling-stroke' d='M0 0 Q50 100, 100 0' />
    </svg>
)
