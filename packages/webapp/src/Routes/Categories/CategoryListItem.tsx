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
            <Link to={redirectUrl} className={`${subCatIndex === 0 ? 'text-lg font-bold' : ''}`}>
                {CategoryLabel[categoryKey]}
            </Link>
        </div>
    )
}

export default CategoryListItem
