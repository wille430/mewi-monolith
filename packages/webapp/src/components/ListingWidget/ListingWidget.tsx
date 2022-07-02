import { formatDistance } from 'date-fns'
import sv from 'date-fns/locale/sv'
import { Listing } from '@mewi/prisma'
import { HTMLAttributes } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import style from './ListingWidget.module.scss'
import { LikeButton, ListingLikeButton } from '../LikeButton/LikeButton'
import { OriginLabel } from '@/components/OriginLabel/OriginLabel'
import DefaultImage from '@/components/DefaultImage/DefaultImage'
import { useAppSelector } from '@/hooks'

interface ListingProps extends HTMLAttributes<HTMLElement> {
    listing: Listing
}

export const ListingWidget = ({ listing, onClick, ...rest }: ListingProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.user)

    return (
        <article
            {...rest}
            className={classNames({
                [style['card']]: true,
                [rest.className ?? '']: !!rest.className,
            })}
            data-id={listing.id}
        >
            <div
                className={style['overlay']}
                onClick={(e) => {
                    e.stopPropagation()

                    onClick && onClick(e)
                }}
            />
            {isLoggedIn ? (
                <ListingLikeButton
                    listing={listing}
                    className={classNames({
                        [style['like-button']]: true,
                    })}
                />
            ) : (
                <Link href='/loggain'>
                    <LikeButton data-testid='like-button' className={style['like-button']} />
                </Link>
            )}
            <div className={style['image-wrapper']}>
                <DefaultImage src={listing.imageUrl && listing.imageUrl[0]} alt={listing.title} />
            </div>
            <div className={style['details']}>
                <div className={style['header']}>
                    <span className={style['title']}>{listing.title}</span>

                    <div className='ml-1 flex flex-col text-right'>
                        <OriginLabel origin={listing.origin} />
                        <span className={style['region']}>{listing.region}</span>
                    </div>
                </div>
                <div className={style['bottom']}>
                    <span className={style['price']}>
                        {listing.price?.value} {listing.price?.currency}
                    </span>
                    <span className={style['timestamp']}>
                        {formatDistance(new Date(listing.date), new Date(), {
                            addSuffix: true,
                            locale: sv,
                        }).replace('ungefär', 'ca.')}
                    </span>
                </div>
            </div>
        </article>
    )
}
