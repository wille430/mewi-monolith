import { categories } from '@mewi/types'
import CategoryListItem from "./CategoryListItem"

const CategoryList = () => {
    return (
        <div className="flex flex-wrap gap-y-12 gap-x-12">
            {categories?.map(cat => <CategoryListItem categoryData={cat}></CategoryListItem>)}
        </div>
    )
}

export default CategoryList