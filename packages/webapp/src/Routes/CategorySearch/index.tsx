import { categoriesOptions, categories, Category } from '@mewi/types'
import AdPlaceholder from 'common/components/AdPlaceholder'
import CategorySelectionList from 'common/components/CategorySelectionList'
import Layout from 'common/components/Layout'
import { SearchContext } from 'common/context/SearchContext'
import { contextsKey } from 'express-validator/src/base'
import _ from 'lodash'
import { ReactNode, useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import FilterArea from 'Routes/Search/FilterArea'
import ItemGrid from 'Routes/Search/ItemGrid'
import { SelectedItemProvider } from 'Routes/Search/ItemGrid/ItemPopUp/SelectedItemContext'
import PageNav from 'Routes/Search/PageNav'
import ResultText from 'Routes/Search/ResultText'
import SortButton from 'Routes/Search/SortButton'
import styles from './index.module.scss'
import classNames from 'classnames'

const cx = classNames.bind(styles)

interface ParamTypes {
    category_id: string
    subcat_id?: string
}

const CategorySearch = () => {
    const params = useParams<ParamTypes>()
    const {filters, setFilters} = useContext(SearchContext)

    useEffect(() => {
        setFilters({
            ...filters,
            category: params.subcat_id || params.category_id
        })
    }, [params])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className={cx({
                ['main']: true,
                [styles.main]: true
            })}>
                <AdPlaceholder size='lg' className='mb-12' />
                <div className='flex flex-col gap-8 lg:gap-4 lg:flex-row'>
                    <CategorySelectionList
                        currentCategories={{
                            0: params.category_id,
                        }}
                    />
                    <div className=''>
                        <CategoryPathLabel categoryValues={params} />
                        <FilterArea
                            exclude={{ category: true }}
                            defaultValues={{
                                category: params.subcat_id || params.category_id,
                            }}
                            showKeywordField
                        />
                        <div className='w-full flex justify-between py-2 pb-6'>
                            <ResultText />
                            <SortButton />
                        </div>

                        <SelectedItemProvider>
                            <ItemGrid />
                        </SelectedItemProvider>

                        <PageNav />
                    </div>
                </div>
            </main>
            <aside className='side-col space-y-16'>
                <AdPlaceholder />
                <AdPlaceholder />
            </aside>
        </Layout>
    )
}

interface CategoryPathLabelProps {
    categoryValues: ParamTypes
}

const CategoryPathLabel = ({ categoryValues }: CategoryPathLabelProps) => {
    const renderLinks = () => {
        const links: ReactNode[] = []

        let parentCategory: Category | undefined = undefined
        let parentLinkPath = '/kategorier'

        Object.values(categoryValues).forEach((catVal) => {
            if (!parentCategory) {
                parentCategory = categories[catVal]
            } else {
                parentCategory = parentCategory.subcat[catVal]
            }

            parentLinkPath = `${parentLinkPath}/${catVal}`

            links.push(<Link to={parentLinkPath}>{parentCategory.label}</Link>)
        })

        // Add > between each link
        const linksWithSpacers: ReactNode[] = []

        links.forEach((ele, index) => {
            linksWithSpacers.push(ele)
            if (index !== links.length - 1) {
                linksWithSpacers.push(<span className=''>{'>'}</span>)
            }
        })

        return linksWithSpacers
    }

    return <span className='space-x-2 text-sm text-gray'>{renderLinks()}</span>
}

export default CategorySearch
