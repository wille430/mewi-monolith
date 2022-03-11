import { categories } from '@mewi/types'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import _ from 'lodash'
import { ReactNode, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { updateFilters } from 'store/search/creators'
import styles from './CategorySelectionList.module.scss'

const cx = classNames.bind(styles)

/**
 *
 * @param categoryPath An array of keys nested in categories
 * @returns null || {@link Category}
 */
const getNestedCategory = (categoryPath: string[]) => {
    let category = null

    for (const catKey of categoryPath) {
        if (!category) {
            category = categories[catKey]
        } else {
            category = category.subcat[catKey]
        }
    }

    return category
}

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
            updateFilters({
                category: selectedCategory,
            })
        )

        lastCategoryPath.current = currentCategoryPath
    }

    useEffect(() => updateCategoryFilter(), [currentCategoryPath])

    /**
     * Determine if a category is currently selected
     */
    const isCategorySelected = (categoryPath: string[]) => {
        const sliced = currentCategoryPath.slice(0, categoryPath.length)

        if (_.isEqual(sliced, categoryPath)) {
            return true
        }

        return false
    }

    const renderListItems = (categoryPath: string[] = []) => {
        if (categoryPath.length) {
            // if not empty, find the category from the keys in categoryPath
            const category = getNestedCategory(categoryPath)

            // if null, exit
            if (!category) return

            return Object.keys(category?.subcat || {}).map((key) => {
                const subcategoryPath = [...categoryPath, key]
                const isSelected = isCategorySelected(subcategoryPath)

                return (
                    <CategorySelectionList.ListItem
                        key={key}
                        categoryPath={subcategoryPath}
                        currentlySelected={isSelected}
                    >
                        {isSelected && renderListItems(subcategoryPath)}
                    </CategorySelectionList.ListItem>
                )
            })
        } else {
            return Object.keys(categories).map((key) => {
                const isSelected = isCategorySelected([key])

                return (
                    <CategorySelectionList.ListItem
                        key={key}
                        categoryPath={[key]}
                        currentlySelected={isSelected}
                    >
                        {isSelected && renderListItems([key])}
                    </CategorySelectionList.ListItem>
                )
            })
        }
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
    categoryPath: string[]
    children: ReactNode
}

/**
 *
 * @param currentlySelected Whether category is selected
 * @param categoryPath An array of keys to the category in {@link categories}
 */
const CategoryListItem = ({ categoryPath, children, currentlySelected }: ListItem) => {
    const category = getNestedCategory(categoryPath)

    const getLink = () => {
        return '/kategorier/' + categoryPath.join('/') + window.location.search
    }

    return (
        <li
            className={cx({
                [styles.subcat]: categoryPath.length > 1,
                [styles.selected]: currentlySelected,
            })}
            data-testid={`categoryListItem-${categoryPath.length - 1}`}
        >
            <Link to={getLink()}>{category?.label}</Link>
            <ul>{children}</ul>
        </li>
    )
}

CategorySelectionList.ListItem = CategoryListItem

export default CategorySelectionList