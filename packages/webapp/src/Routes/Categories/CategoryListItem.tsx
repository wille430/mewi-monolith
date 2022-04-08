import { Link } from 'react-router-dom'
import { Category, CategoryLabel } from '@wille430/common'
import { motion } from 'framer-motion'

interface Props {
    categoryKey: keyof typeof Category
    subCatIndex?: number
    parentTo?: string
    index?: number
}

const CategoryListItem = ({
    categoryKey,
    subCatIndex = 0,
    parentTo = '/kategorier',
    index = 0,
}: Props) => {
    const redirectUrl = `${parentTo}/${Category[categoryKey]}`

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
            <Link to={redirectUrl} className='block w-32'>
                <div className='h-20 w-20 bg-gray-300 rounded-full mx-auto' />
                <span className='block text-center'>{CategoryLabel[categoryKey]}</span>
            </Link>
        </motion.div>
    )
}

export default CategoryListItem
