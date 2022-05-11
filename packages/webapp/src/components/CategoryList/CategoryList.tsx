import { Category } from '@mewi/prisma/index-browser'
import { CategoryListItem } from './CategoryListItem/CategoryListItem'

export const CategoryList = () => (
    <div
        className='flex flex-wrap gap-y-12 gap-x-12 sm:gap-y-24 sm:gap-x-24 justify-center py-6 sm:py-12'
        data-testid='categoryList'
    >
        {Object.keys(Category).map((key, i) => (
            <CategoryListItem categoryKey={key as keyof typeof Category} index={i} />
        ))}
    </div>
)
