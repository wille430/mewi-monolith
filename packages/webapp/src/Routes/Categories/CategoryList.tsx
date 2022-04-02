import { Category } from '@mewi/common/types'
import CategoryListItem from './CategoryListItem'

const CategoryList = () => {
    return (
        <div className='flex flex-wrap gap-y-12 gap-x-12 justify-center' data-testid='categoryList'>
            {Object.keys(Category).map((key) => (
                <CategoryListItem categoryKey={key as keyof typeof Category} />
            ))}
        </div>
    )
}

export default CategoryList
