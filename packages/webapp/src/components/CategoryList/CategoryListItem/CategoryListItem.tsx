import { CategoryLabel } from '@wille430/common'
import { Category } from '@mewi/prisma/index-browser'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AiFillCar, AiOutlineMobile } from 'react-icons/ai'
import { MdOutlineSportsCricket, MdPersonOutline, MdStore } from 'react-icons/md'
import { BsHouse } from 'react-icons/bs'
import { FiPlus } from 'react-icons/fi'
import { IconType } from 'react-icons/lib'

interface Props {
    categoryKey: keyof typeof Category
    subCatIndex?: number
    parentTo?: string
    index?: number
}

export const categoryIconMap: Record<Category, IconType> = {
    AFFARSVERKSAMHET: MdStore,
    ELEKTRONIK: AiOutlineMobile,
    FORDON: AiFillCar,
    FOR_HEMMET: BsHouse,
    FRITID_HOBBY: MdOutlineSportsCricket,
    OVRIGT: FiPlus,
    PERSONLIGT: MdPersonOutline,
}

export const CategoryListItem = ({
    categoryKey,
    subCatIndex = 0,
    parentTo = '/kategorier',
    index = 0,
}: Props) => {
    const redirectUrl = `${parentTo}/${Category[categoryKey]}`.toLowerCase()
    const Icon = categoryIconMap[categoryKey]

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
                    <Icon className='h-20 w-20 bg-primary rounded-full mx-auto p-4' color='white' />
                    <span className='block text-center'>{CategoryLabel[categoryKey]}</span>
                </div>
            </Link>
        </motion.div>
    )
}
