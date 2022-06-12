import React, { useEffect, useMemo, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { motion, HTMLMotionProps, useAnimation, Variants } from 'framer-motion'
import { Listing } from '@mewi/prisma/index-browser'
import axios from 'axios'
import { useMutation } from 'react-query'
import { useAppSelector } from '../../hooks'

type LikeButtonProps = HTMLMotionProps<'button'> & {
    liked?: boolean
}

export const ListingLikeButton = ({
    listing,
    ...rest
}: { listing: Listing } & HTMLMotionProps<'button'>) => {
    const { user } = useAppSelector((state) => state.user)
    const [liked, setLiked] = useState(user && listing.likedByUserIDs.includes(user.id))

    useEffect(() => {
        setLiked(user && listing.likedByUserIDs.includes(user.id))
    }, [listing.likedByUserIDs])

    const likeMutation = useMutation(() => axios.put(`/listings/${listing.id}/like`), {
        onMutate: () => setLiked(true),
    })
    const unlikeMutation = useMutation(() => axios.put(`/listings/${listing.id}/unlike`), {
        onMutate: () => setLiked(false),
    })

    return (
        <LikeButton
            {...rest}
            liked={liked}
            onClick={() => {
                if (liked) {
                    unlikeMutation.mutate()
                } else {
                    likeMutation.mutate()
                }
            }}
        />
    )
}

export const LikeButton = ({ liked = false, onClick, ...rest }: LikeButtonProps) => {
    const controller = useAnimation()

    const variants: Variants = useMemo(
        () => ({
            like: {
                scale: [1.4, 1.2],
                color: 'red',
                transition: {
                    type: 'spring',
                    duration: 0.5,
                },
            },
            hovered: {
                scale: 1.1,
            },
            hold: {
                scale: 1.2,
                transition: {
                    duration: 1,
                },
            },
            initial: {
                color: liked ? 'red' : 'white',
                scale: liked ? 1.05 : 1,
            },
        }),
        [liked]
    )

    return (
        <motion.button
            {...rest}
            animate={controller}
            initial={'initial'}
            variants={variants}
            whileHover={'hover'}
            whileTap={'hold'}
            data-liked={liked}
            onClick={(e) => {
                controller.start('like').then(() => controller.start('initial'))
                onClick && onClick(e)
            }}
        >
            {liked ? (
                <AiFillHeart className='h-7 w-7' color={liked ? 'red' : 'white'} />
            ) : (
                <AiOutlineHeart className='h-7 w-7' color={liked ? 'red' : 'white'} />
            )}
        </motion.button>
    )
}
