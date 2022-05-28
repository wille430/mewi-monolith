import React, { useMemo } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { motion, HTMLMotionProps, useAnimation, Variants } from 'framer-motion'

type LikeButtonProps = HTMLMotionProps<'button'> & {
    liked?: boolean
}

export const LikeButton = ({ liked, onClick, ...rest }: LikeButtonProps) => {
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
