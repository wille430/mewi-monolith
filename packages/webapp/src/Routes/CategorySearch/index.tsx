import { categories, Category } from '@mewi/types'
import CategorySelectionList from 'components/CategorySelectionList'
import Layout from 'components/Layout'
import { ReactNode, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import FilterArea from 'components/FilterArea'
import ItemGrid from 'components/ItemGrid'
import PageNav from 'components/PageNav'
import ResultText from 'components/ResultText'
import SortButton from 'components/SortButton'
import styles from './index.module.scss'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { clearFilters } from 'store/search/creators'

const cx = classNames.bind(styles)

interface ParamTypes {
    category_id: string
    subcat_id?: string
}

const CategorySearch = () => {
    const params = useParams<ParamTypes>()
    const dispatch = useDispatch()

    const scrollEle = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    return (
        <Layout>
            <aside className='side-col'></aside>
            <main
                className={cx({
                    main: true,
                    [styles.main]: true,
                })}
            >
                {/* <AdPlaceholder size='lg' className='mb-12' /> */}
                <div className='flex flex-col gap-8 lg:flex-row lg:gap-4'>
                    <CategorySelectionList />
                    <div className=''>
                        <CategoryPathLabel categoryValues={params} />

                        <div ref={scrollEle}>
                            <FilterArea exclude={{ category: true }} showKeywordField />
                        </div>

                        <div className='flex w-full justify-between py-2 pb-6'>
                            <ResultText />
                            <SortButton />
                        </div>

                        <ItemGrid />

                        <PageNav anchorEle={scrollEle} />
                    </div>
                </div>
            </main>
            <aside className='side-col space-y-16'>
                {/* <AdPlaceholder />
                <AdPlaceholder /> */}
            </aside>
        </Layout>
    )
}

interface CategoryPathLabelProps {
    categoryValues: ParamTypes
}

const CategoryPathLabel = ({ categoryValues }: CategoryPathLabelProps) => {
    const history = useHistory()

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

            if (!parentCategory) {
                history.replace({
                    pathname: '/404',
                })
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

    return <span className='text-gray space-x-2 text-sm'>{renderLinks()}</span>
}

export default CategorySearch
