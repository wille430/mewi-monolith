import { formatDistance } from 'date-fns'
import sv from 'date-fns/locale/sv'
import type { IListing } from '@/common/schemas'
import type { HTMLAttributes } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import type { ListingOrigin } from '@/common/schemas'
import style from './ListingWidget.module.scss'
import { LikeButton, ListingLikeButton } from '../LikeButton/LikeButton'
import DefaultImage from '@/lib/components/DefaultImage/DefaultImage'
import { useAppSelector } from '@/lib/hooks'
import { getColor, getTextColor } from '@/lib/constants/OriginColors'

interface ListingProps extends HTMLAttributes<HTMLElement> {
    listing: IListing
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

            <OriginTag origin={listing.origin} />

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

                    <div className='ml-1 text-right'>
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

const OriginTag = ({ origin }: { origin: ListingOrigin }) => {
    return (
        <div
            className={`absolute py-0.5 pr-3 pl-1  text-xs font-bold`}
            style={{
                backgroundColor: getColor(origin),
                color: getTextColor(origin),
                clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
            }}
        >
            <span>{origin}</span>
        </div>
    )
}