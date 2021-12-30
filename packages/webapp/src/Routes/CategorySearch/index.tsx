import { categories, Category } from '@mewi/types'
import AdPlaceholder from 'components/AdPlaceholder'
import CategorySelectionList from 'components/CategorySelectionList'
import Layout from 'components/Layout'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import FilterArea from 'Routes/Search/FilterArea'
import ItemGrid from 'Routes/Search/ItemGrid'
import PageNav from 'Routes/Search/PageNav'
import ResultText from 'Routes/Search/ResultText'
import SortButton from 'Routes/Search/SortButton'
import styles from './index.module.scss'
import _ from 'lodash'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { clearFilters, getSearchResults, setFilters } from 'store/search/creators'
import queryString from 'query-string'

const cx = classNames.bind(styles)

interface ParamTypes {
    category_id: string
    subcat_id?: string
}

const CategorySearch = () => {
    const params = useParams<ParamTypes>()
    const dispatch = useDispatch()
    const location = useLocation()

    const defaultValues = {
        category: params.subcat_id || params.category_id,
    }

    useEffect(() => {
        const newFilters = _.merge(queryString.parse(location.search), defaultValues)
        dispatch(setFilters(newFilters))

        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    useEffect(() => {
        // when /category_id/subcat_id changes, set filters to default
        dispatch(setFilters(defaultValues))
    }, [params.category_id, params.subcat_id])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main
                className={cx({
                    main: true,
                    [styles.main]: true,
                })}
            >
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
                            defaultValues={defaultValues}
                            showKeywordField
                        />
                        <div className='w-full flex justify-between py-2 pb-6'>
                            <ResultText />
                            <SortButton />
                        </div>

                        <ItemGrid />

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
