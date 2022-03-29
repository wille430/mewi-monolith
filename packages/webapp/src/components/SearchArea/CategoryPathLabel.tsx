import { categories, Category } from '@mewi/common/types'
import { ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'

interface CategoryPathLabelProps {
    categoryValues: ParamTypes
}

export interface ParamTypes {
    category_id: string
    subcat_id?: string
}

const CategoryPathLabel = ({ categoryValues }: CategoryPathLabelProps) => {
    const history = useHistory()

    const renderLinks = () => {
        const links: ReactNode[] = []

        let parentCategory: Category | undefined = undefined
        let parentLinkPath = '/kategorier'

        Object.values(categoryValues).forEach((catVal) => {
            if (!catVal) return

            if (!parentCategory) {
                parentCategory = categories[catVal]
            } else {
                parentCategory = parentCategory.subcat[catVal]
            }

            parentLinkPath = `${parentLinkPath}/${catVal}`

            links.push(
                <Link key={parentCategory._id} to={parentLinkPath}>
                    {parentCategory.label}
                </Link>
            )
        })

        // Add > between each link
        const linksWithSpacers: ReactNode[] = []

        links.forEach((ele, index) => {
            linksWithSpacers.push(ele)
            if (index !== links.length - 1) {
                linksWithSpacers.push(
                    <span key={index} className=''>
                        {'>'}
                    </span>
                )
            }
        })

        return linksWithSpacers
    }

    return <span className='text-gray space-x-2 text-sm'>{renderLinks()}</span>
}

export default CategoryPathLabel
