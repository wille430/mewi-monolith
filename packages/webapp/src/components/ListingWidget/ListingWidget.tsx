import { formatDistance } from 'date-fns'
import sv from 'date-fns/locale/sv'
import { Listing } from '@mewi/prisma'
import { HTMLAttributes, useEffect } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import style from './ListingWidget.module.scss'
import { LikeButton } from '../LikeButton/LikeButton'
import { OriginLabel } from '@/components/OriginLabel/OriginLabel'
import DefaultImage from '@/components/DefaultImage/DefaultImage'
import { useAppSelector } from '@/hooks'

interface ListingProps extends HTMLAttributes<HTMLElement> {
    listing: Listing
    onLike?: (id: string) => any
    onUnlike?: (id: string) => any
}

export const ListingWidget = ({ listing, onClick, onLike, onUnlike, ...rest }: ListingProps) => {
    const { user, isLoggedIn } = useAppSelector((state) => state.user)
    const isLiked = user && listing.likedByUserIDs.includes(user.id)

    useEffect(() => {
        console.log(isLiked)
    }, [])

    return (
        <article
            {...rest}
            className={classNames({
                [style['card']]: true,
                [rest.className ?? '']: !!rest.className,
            })}
        >
            <div
                className={style['overlay']}
                onClick={(e) => {
                    e.stopPropagation()

                    onClick && onClick(e)
                }}
            />
            {isLoggedIn ? (
                <LikeButton
                    className={classNames({
                        [style['like-button']]: true,
                        [style['liked']]: isLiked,
                    })}
                    liked={isLiked}
                    onClick={() => {
                        if (isLiked) {
                            onUnlike && onUnlike(listing.id)
                        } else {
                            onLike && onLike(listing.id)
                        }
                    }}
                />
            ) : (
                <Link href='/loggain'>
                    <LikeButton className={style['like-button']} />
                </Link>
            )}
            <div className={style['image-wrapper']}>
                <DefaultImage src={listing.imageUrl[0]} alt={listing.title} />
            </div>
            <div className={style['details']}>
                <div className={style['header']}>
                    <span className={style['title']}>{listing.title}</span>

                    <div className='flex flex-col text-right ml-1'>
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
