import { Listing } from '@mewi/prisma'
import { AnimationProps, HTMLMotionProps, motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@mewi/ui'
import styles from './ListingRow.module.scss'
import DefaultImage from '@/components/DefaultImage/DefaultImage'
import { useAppDispatch } from '@/hooks'
import { openListing } from '@/store/listings'

interface ListingRowprops extends HTMLMotionProps<'article'> {
    item: Listing
}

export const ListingRow = ({ item, ...rest }: ListingRowprops) => {
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
            {...rest}
        >
            <DefaultImage className={styles.image} src={item.imageUrl[0]} alt={item.title} />
            <motion.div className={styles.description}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
            </motion.div>

            <motion.div className='relative h-full'>
                <motion.div
                    className={styles.details}
                    variants={fadeVariants}
                    animate={isHovered ? 'hide' : 'show'}
                >
                    <span className={styles.regionText}>{item.region}</span>
                    {item.price && (
                        <span
                            className={styles.priceText}
                        >{`${item.price?.value} ${item.price?.currency}`}</span>
                    )}
                </motion.div>

                <motion.div
                    className={styles.redirectButton}
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
                    <Button label='>>' onClick={() => dispatch(openListing(item))} />
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
