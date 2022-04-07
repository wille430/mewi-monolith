// import { categories } from '@wille430/common/types'
import { Category, CategoryLabel, Sort } from '@wille430/common/types'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import _ from 'lodash'
import { ReactNode, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { setFilters } from 'store/search/creators'
import styles from './CategorySelectionList.module.scss'

const cx = classNames.bind(styles)

const CategorySelectionList = () => {
    // /kategorier/:category_id/:subcat_id
    const { category_id, subcat_id } = useParams<any>()
    const { filters } = useAppSelector((state) => state.search)

    const currentCategoryPath = [category_id, subcat_id].filter((x) => x !== undefined) as string[] // <== remove all null values
    const lastCategoryPath = useRef(currentCategoryPath)

    const dispatch = useAppDispatch()

    const updateCategoryFilter = () => {
        const selectedCategory = currentCategoryPath[currentCategoryPath.length - 1]

        // only update filters if category path changed
        if (
            _.isEqual(lastCategoryPath.current, currentCategoryPath) &&
            filters.category === selectedCategory
        ) {
            return
        }

        // on render, set category to current path
        dispatch(
            setFilters({
                category: selectedCategory,
                sort: Sort.RELEVANCE,
            })
        )

        lastCategoryPath.current = currentCategoryPath
    }

    useEffect(() => updateCategoryFilter(), [currentCategoryPath])

    /**
     * Determine if a category is currently selected
     */
    const isCategorySelected = (currentCat: Category) => {
        if (currentCategoryPath.includes(currentCat as any)) {
            return true
        }
        return false
    }

    const renderListItems = () => {
        return Object.keys(Category).map((key) => {
            const isSelected = isCategorySelected(Category[key])

            return (
                <CategoryListItem
                    key={key}
                    categoryKey={key as keyof typeof Category}
                    currentlySelected={isSelected}
                />
            )
        })
    }

    return (
        <div
            id='categorySelection'
            data-testid='categorySelectionList'
            className={styles.container}
        >
            <ul>{renderListItems()}</ul>
        </div>
    )
}

interface ListItem {
    currentlySelected: boolean
    children?: ReactNode
    categoryKey: keyof typeof Category
}

/**
 *
 * @param currentlySelected Whether category is selected
 * @param categoryPath An array of keys to the category in {@link categories}
 */
const CategoryListItem = ({ children, categoryKey, currentlySelected }: ListItem) => (
    <li
        className={cx({
            [styles.selected]: currentlySelected,
        })}
        data-testid={`categoryListItem-${Category[categoryKey]}`}
    >
        <Link to={'/kategorier/' + Category[categoryKey] + window.location.search || ''}>
            <span>{CategoryLabel[categoryKey]}</span>
        </Link>
        <ul>{children}</ul>
    </li>
)

export default CategorySelectionList
