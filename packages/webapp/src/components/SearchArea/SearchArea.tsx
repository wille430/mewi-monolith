import CategorySelectionList from 'components/CategorySelectionList/CategorySelectionList'
import CategoryPathLabel from './CategoryPathLabel'
import FilterArea from 'components/FilterArea/FilterArea'
import ListingGrid from 'components/ListingGrid/ListingGrid'
import PageNav from 'components/PageNav/PageNav'
import ResultText from 'components/ResultText/ResultText'
import SortButton from 'components/SortButton/SortButton'
import { useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './SearchArea.module.scss'
import classNames from 'classnames'
import { useAppSelector } from 'hooks/hooks'
import { Category } from '@mewi/common/types'

const cx = classNames.bind(styles)

const SearchArea = () => {
    const categoryValue = useParams()['category_id'] as undefined | Category
    const scrollEle = useRef<HTMLDivElement | null>(null)
    const { searchParams,  } = useAppSelector((state) => state.search)
    const history = useHistory()
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (history.location.search !== searchParams) {
            history.push(window.location.pathname + searchParams)
        }
    }, [searchParams])

    return (
        <section
            className={cx({
                [styles.container]: true,
            })}
        >
            <aside>
                <h4 className='pb-2'>Kategorier</h4>
                <CategorySelectionList />
            </aside>

            <div className='flex flex-grow flex-col'>
                <CategoryPathLabel categories={[categoryValue]} />

                <div ref={scrollEle}>
                    <FilterArea exclude={{ category: true }} showKeywordField />
                </div>

                <div className='flex w-full justify-between py-2 pb-6'>
                    <ResultText />
                    <SortButton />
                </div>

                <ListingGrid />

                <PageNav anchorEle={scrollEle} />
            </div>
        </section>
    )
}

export default SearchArea
