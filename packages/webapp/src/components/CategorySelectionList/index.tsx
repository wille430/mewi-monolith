import { categories } from '@mewi/types'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './index.module.scss'

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
    const currentCategoryPath = [category_id, subcat_id].filter((x) => Boolean(x)) // <== remove all null values

    /**
     * Determine if a category is currently selected
     */
    const isCategorySelected = (categoryPath: string[]) => {
        for (let i = 0; i < categoryPath.length; i++) {
            if (categoryPath[i] !== currentCategoryPath[i]) {
                // return false if the values doesn't match
                return false
            }
        }

        return true
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
        <section className={styles.container}>
            <ul>{renderListItems()}</ul>
        </section>
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
const CategoryListItem = ({ categoryPath, children }: ListItem) => {
    const getLink = () => {
        return '/kategorier/' + categoryPath.join('/')
    }

    const getLabel = () => {
        return getNestedCategory(categoryPath)?.label
    }

    return (
        <li
            className={cx({
                [styles.subcat]: categoryPath.length > 1,
            })}
        >
            {/* TODO: text of selected category should be bold */}
            <Link to={getLink()}>{getLabel()}</Link>
            {children}
        </li>
    )
}

CategorySelectionList.ListItem = CategoryListItem

export default CategorySelectionList
