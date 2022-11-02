import React, { useEffect, useMemo, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import { motion, useAnimation } from 'framer-motion'
import type { IListing, IUserLean } from '@/common/schemas'
import { useMutation } from 'react-query'
import { useAppSelector } from '../../hooks'
import { client } from '@/lib/client'

export type ListingLikeButtonProps = {
    listing: IListing
    liked?: boolean
} & HTMLMotionProps<'button'>

export type LikeButtonProps = HTMLMotionProps<'button'> & {
    liked?: boolean
}

export const ListingLikeButton = ({
    listing,
    liked: _liked = false,
    ...rest
}: ListingLikeButtonProps) => {
    const user = useAppSelector((state) => state.user.user) as IUserLean | undefined
    const [liked, setLiked] = useState(_liked)

    useEffect(() => {
        setLiked(user?.likedListings.includes(listing.id) ?? false)
    }, [user?.likedListings, user])

    const likeMutation = useMutation(() => client.put(`/listings/${listing.id}/like`), {
        onMutate: () => setLiked(true),
    })
    const unlikeMutation = useMutation(() => client.put(`/listings/${listing.id}/unlike`), {
        onMutate: () => setLiked(false),
    })

    return (
        <LikeButton
            aria-label='Gilla'
            data-testid='like-button'
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
