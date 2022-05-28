import { Listing } from '@mewi/prisma'
import { AnimationProps, HTMLMotionProps, motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@mewi/ui'
import styles from './ListingRow.module.scss'
import { LikeButton } from '../LikeButton/LikeButton'
import DefaultImage from '@/components/DefaultImage/DefaultImage'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { openListing } from '@/store/listings'

interface ListingRowprops extends HTMLMotionProps<'article'> {
    listing: Listing
    onLike?: (id: string) => any
    onUnlike?: (id: string) => any
}

export const ListingRow = ({ listing, onLike, onUnlike, ...rest }: ListingRowprops) => {
    const [isHovered, setHovered] = useState(false)
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.user)

    const fadeVariants: AnimationProps['variants'] = {
        hide: {
            opacity: 0,
            transitionEnd: {
                pointerEvents: 'none',
            },
        },
        show: {
            opacity: 1,
            pointerEvents: 'auto',
        },
    }
    const scaleVariants: AnimationProps['variants'] = {
        initial: { scale: 1 },
        scale: { scale: 1.0025 },
    }

    return (
        <motion.article
            className={styles.listingContainer}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            variants={scaleVariants}
            animate={isHovered ? 'scale' : 'initial'}
            {...rest}
        >
            <DefaultImage className={styles.image} src={listing.imageUrl[0]} alt={listing.title} />
            <motion.div className={styles.description}>
                <h4>{listing.title}</h4>
                <p>{listing.body}</p>
            </motion.div>

            <motion.div className='relative h-full'>
                <motion.div
                    className={styles.details}
                    variants={fadeVariants}
                    animate={isHovered ? 'hide' : 'show'}
                >
                    <span className={styles.regionText}>{listing.region}</span>
                    {listing.price && (
                        <span
                            className={styles.priceText}
                        >{`${listing.price?.value} ${listing.price?.currency}`}</span>
                    )}
                </motion.div>

                <motion.div
                    className={styles.actions}
                    variants={{
                        ...fadeVariants,
                        hide: {
                            ...fadeVariants.hide,
                            transitionEnd: {},
                        },
                    }}
                    initial={'hide'}
                    animate={isHovered ? 'show' : 'hide'}
                >
                    <LikeButton
                        className='ml-auto'
                        liked={user && listing.likedByUserIDs.includes(user.id)}
                        onClick={() => {
                            if (user && listing.likedByUserIDs.includes(user.id)) {
                                onUnlike && onUnlike(listing.id)
                            } else {
                                onLike && onLike(listing.id)
                            }
                        }}
                    />
                    <Button
                        className={styles.redirect}
                        label='>>'
                        onClick={() => dispatch(openListing(listing))}
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className={styles.overlay}
                variants={fadeVariants}
                animate={isHovered ? 'show' : 'hide'}
            />
        </motion.article>
    )
}
