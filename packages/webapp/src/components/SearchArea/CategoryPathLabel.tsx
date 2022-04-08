import { Category, CategoryLabel } from '@wille430/common'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CategoryPathLabelProps {
    categories: Category[]
}

const CategoryPathLabel = ({ categories }: CategoryPathLabelProps) => {
    const renderLinks = () => {
        const links: ReactNode[] = [<Link to='/kategorier'>Alla kategorier</Link>]

        for (const value of categories || []) {
            const indexOfValue = Object.values(categories).indexOf(value)
            links.push(
                <Link key={value} to={'/kategorier/' + value}>
                    {CategoryLabel[Object.keys(Category)[indexOfValue]]}
                </Link>
            )
        }

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
