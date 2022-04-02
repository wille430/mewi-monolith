import { Link } from 'react-router-dom'
import { Category, CategoryLabel } from '@mewi/common/types'

interface Props {
    categoryKey: keyof typeof Category
    subCatIndex?: number
    parentTo?: string
}

const CategoryListItem = ({ categoryKey, subCatIndex = 0, parentTo = '/kategorier' }: Props) => {
    const redirectUrl = `${parentTo}/${Category[categoryKey]}`

    return (
        <div data-testid={`categoryListItem-${subCatIndex}`}>
            <Link to={redirectUrl} className='block w-32'>
                <div className='h-16 w-16 bg-green rounded-full mx-auto' />
                <span className='block text-center'>{CategoryLabel[categoryKey]}</span>
            </Link>
        </div>
    )
}

export default CategoryListItem
