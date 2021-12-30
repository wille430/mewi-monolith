import { categories } from '@mewi/types'
import CategoryListItem from './CategoryListItem'

const CategoryList = () => {
    return (
        <div className='flex flex-wrap gap-y-12 gap-x-12'>
            {Object.keys(categories).map((key) => (
                <CategoryListItem
                    categoryValue={key}
                    categoryData={categories[key]}
                ></CategoryListItem>
            ))}
        </div>
    )
}

export default CategoryList
