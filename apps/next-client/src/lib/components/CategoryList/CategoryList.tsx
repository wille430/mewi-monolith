import {CategoryListItem} from './CategoryListItem/CategoryListItem'
import {Category} from "@mewi/models"

export const CategoryList = () => (
    <div
        className="flex flex-wrap justify-center gap-y-12 gap-x-12 py-6 sm:gap-y-24 sm:gap-x-24 sm:py-12"
        data-testid="categoryList"
    >
        {Object.keys(Category).map((key, i) => (
            <CategoryListItem key={key} categoryKey={key as keyof typeof Category} index={i}/>
        ))}
    </div>
)
