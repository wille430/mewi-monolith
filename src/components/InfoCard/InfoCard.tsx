import clsx from 'clsx'
import type { ReactNode } from 'react'

export type InfoCardProps = {
    heading?: string | ReactNode
    body: string | ReactNode
    src?: string
    className?: string
}

export const InfoCard = ({ heading, body, src, className }: InfoCardProps) => (
    <article className={clsx('card', className)}>
        <div className='card__body'>
            {heading && <h5 className='card__heading'>{heading}</h5>}
            <p className='card__text'>{body}</p>
        </div>
        {src && (
            <div className='card__image-wrapper'>
                <img className='card__img' src={src ?? '/img/missingImage.png'} loading='lazy' />
            </div>
        )}
    </article>
)
