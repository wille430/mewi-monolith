import type { AnimationProps, HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './ListingRow.module.scss'
import { ListingLikeButton } from '../LikeButton/LikeButton'
import { Button } from '../Button/Button'
import DefaultImage from '@/lib/components/DefaultImage/DefaultImage'
import { useAppDispatch } from '@/lib/hooks'
import { openListing } from '@/lib/store/listings'
import clsx from 'clsx'
import {ListingDto} from "@mewi/models"

interface ListingRowprops extends HTMLMotionProps<'article'> {
    listing: ListingDto
}

export const ListingRow = ({ listing, ...rest }: ListingRowprops) => {
    const [isHovered, setHovered] = useState(false)
    const dispatch = useAppDispatch()

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
            data-id={listing.id}
            {...rest}
        >
            <div className={clsx(styles.image, 'relative')}>
                <DefaultImage src={listing.imageUrl[0]} alt={listing.title} />
            </div>
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
                    <ListingLikeButton listing={listing} className='ml-auto' />
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