import { categories, Category } from '@mewi/types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface CategorySelectionListProps {
    currentCategories: {
        [key: number]: string
    }
}

const CategorySelectionList = ({ currentCategories }: CategorySelectionListProps) => {
    const renderListItems = () => {
        return Object.keys(categories).map((key) => {
            const value = categories[key]

            let currentlySelected = false

            if (currentCategories[0] === key) {
                currentlySelected = true
            }

            return (
                <CategorySelectionList.ListItem
                    categoryKey={key}
                    categoryValue={value}
                    currentlySelected={currentlySelected}
                    currentCategories={currentCategories}
                    depth={0}
                    parentLink='/kategorier'
                />
            )
        })
    }

    return (
        <section className={styles.container}>
            <ul>{renderListItems()}</ul>
        </section>
    )
}

interface ParentCategory {
    categoryKey: string
    categoryValue: Category
    currentlySelected?: boolean
    depth: number
    currentCategories: CategorySelectionListProps['currentCategories']
    parentLink: string
}

CategorySelectionList.ListItem = ({
    categoryKey,
    categoryValue,
    currentlySelected = false,
    currentCategories,
    depth,
    parentLink,
}: ParentCategory) => {
    const newLink = `${parentLink}/${categoryKey}`

    const renderChildListItems = () => {
        return Object.keys(categoryValue.subcat).map((key) => {
            const value = categoryValue.subcat[key]

            let currentlySelected = false

            if (currentCategories[depth + 1] === key) {
                currentlySelected = true
            }

            return (
                <CategorySelectionList.ListItem
                    categoryKey={key}
                    categoryValue={value}
                    currentlySelected={currentlySelected}
                    currentCategories={currentCategories}
                    depth={depth + 1}
                    parentLink={newLink}
                />
            )
        })
    }

    return (
        <li
            className={cx({
                [styles.subcat]: depth >= 1,
            })}
        >
            <Link to={newLink}>{categoryValue.label}</Link>
            {currentlySelected && <ul>{renderChildListItems()}</ul>}
        </li>
    )
}

export default CategorySelectionList
