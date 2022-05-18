import { formatDistance } from 'date-fns'
import sv from 'date-fns/locale/sv'
import { Listing } from '@mewi/prisma'
import { HTMLAttributes } from 'react'
import classNames from 'classnames'
import style from './ListingWidget.module.scss'
import { OriginLabel } from '@/components/OriginLabel/OriginLabel'
import DefaultImage from '@/components/DefaultImage/DefaultImage'

interface ListingProps extends HTMLAttributes<HTMLElement> {
    listing: Listing
}

export const ListingWidget = ({ listing, ...rest }: ListingProps) => (
    <article
        {...rest}
        className={classNames({
            [style['card']]: true,
            [rest.className]: !!rest.className,
        })}
    >
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
