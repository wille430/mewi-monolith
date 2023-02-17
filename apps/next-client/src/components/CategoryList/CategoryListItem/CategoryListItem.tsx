import {motion} from 'framer-motion'
import Link from 'next/link'
import {AiFillCar, AiOutlineMobile} from 'react-icons/ai'
import {MdOutlineSportsCricket, MdPersonOutline, MdStore} from 'react-icons/md'
import {BsHouse} from 'react-icons/bs'
import {FiPlus} from 'react-icons/fi'
import type {IconType} from 'react-icons/lib'
import {Category, CategoryLabel} from "@mewi/models"

interface CategoryListItemProps {
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

export const CategoryListItem = (props: CategoryListItemProps) => {
    const {
        categoryKey,
        subCatIndex = 0,
        parentTo = '/sok',
        index = 0,
    } = props
    const redirectUrl = `${parentTo}?categories=${Category[categoryKey]}`
    const Icon = categoryIconMap[categoryKey]

    return (
        <motion.div
            data-testid={`categoryListItem-${subCatIndex}`}
            initial={{
                transform: 'scale(0)',
            }}
            animate={{
                transform: 'scale(1)',
                transition: {
                    delay: ((index * 2) % 3) * 0.1 + 0.5,
                },
            }}
            whileHover={{
                transform: 'scale(1.02)',
            }}
            whileTap={{
                transform: 'scale(1.05)',
            }}
        >
            <Link href={redirectUrl} className="block w-32">
                <div className="cursor-pointer">
                    <Icon className="mx-auto h-20 w-20 rounded-full bg-primary p-4" color="white"/>
                    <span className="block text-center">{CategoryLabel[categoryKey]}</span>
                </div>
            </Link>
        </motion.div>
    )
}
