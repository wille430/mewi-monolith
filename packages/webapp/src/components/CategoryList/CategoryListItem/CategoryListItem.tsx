import { CategoryLabel } from '@wille430/common'
import { Category } from '@mewi/prisma/index-browser'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
    categoryKey: keyof typeof Category
    subCatIndex?: number
    parentTo?: string
    index?: number
}

export const CategoryListItem = ({
    categoryKey,
    subCatIndex = 0,
    parentTo = '/kategorier',
    index = 0,
}: Props) => {
    const redirectUrl = `${parentTo}/${Category[categoryKey]}`.toLowerCase()

    return (
        <motion.div
            data-testid={`categoryListItem-${subCatIndex}`}
            animate={{
                transform: 'scale(1)',
                transition: {
                    delay: ((index * 2) % 3) * 0.1,
                },
            }}
            whileHover={{
                transform: 'scale(1.02)',
            }}
            whileTap={{
                transform: 'scale(1.05)',
            }}
        >
            <Link href={redirectUrl} className='block w-32'>
                <div className='cursor-pointer'>
                    <div className='h-20 w-20 bg-gray-300 rounded-full mx-auto' />
                    <span className='block text-center'>{CategoryLabel[categoryKey]}</span>
                </div>
            </Link>
        </motion.div>
    )
}
