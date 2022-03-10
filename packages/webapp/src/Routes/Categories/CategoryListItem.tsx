import { Link } from 'react-router-dom'
import { Category } from '@mewi/types'

interface Props {
    categoryValue: string
    categoryData: Category
    subCatIndex?: number
    parentTo?: string
}

const CategoryListItem = ({
    categoryValue,
    categoryData,
    subCatIndex = 0,
    parentTo = '/kategorier',
}: Props) => {
    const redirectUrl = `${parentTo}/${categoryValue}`

    return (
        <div data-testid={`categoryListItem-${subCatIndex}`}>
            <Link to={redirectUrl} className={`${subCatIndex === 0 ? 'text-lg font-bold' : ''}`}>
                {categoryData.label}
            </Link>
            <div className=''>
                {Object.keys(categoryData.subcat).map((key) => (
                    <CategoryListItem
                        categoryValue={key}
                        categoryData={categoryData.subcat[key]}
                        subCatIndex={subCatIndex + 1}
                        parentTo={redirectUrl}
                    />
                ))}
            </div>
        </div>
    )
}

export default CategoryListItem
