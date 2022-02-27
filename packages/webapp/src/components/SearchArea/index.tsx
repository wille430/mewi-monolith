import CategorySelectionList from 'components/CategorySelectionList'
import CategoryPathLabel, { ParamTypes } from './CategoryPathLabel'
import FilterArea from 'components/FilterArea'
import ItemGrid from 'components/ItemGrid'
import PageNav from 'components/PageNav'
import ResultText from 'components/ResultText'
import SortButton from 'components/SortButton'
import { useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styles from './index.module.scss'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { updateSearchParams } from 'store/search/creators'

const cx = classNames.bind(styles)

const SearchArea = () => {
    const params = useParams<ParamTypes>()
    const scrollEle = useRef<HTMLDivElement | null>(null)
    const { searchParams, filters, page, sort } = useAppSelector((state) => state.search)
    const history = useHistory()
    const isFirstRender = useRef(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (history.location.search !== searchParams) {
            console.log({ current: history.location.search, new: searchParams })
            history.push(window.location.pathname + searchParams)
        }
    }, [searchParams])

    useEffect(() => {
        dispatch(updateSearchParams())
    }, [filters, page, sort])

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
        </section>
    )
}

export default SearchArea
