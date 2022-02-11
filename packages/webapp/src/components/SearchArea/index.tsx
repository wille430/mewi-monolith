import CategorySelectionList from 'components/CategorySelectionList'
import CategoryPathLabel, { ParamTypes } from './CategoryPathLabel'
import FilterArea from 'components/FilterArea'
import ItemGrid from 'components/ItemGrid'
import PageNav from 'components/PageNav'
import ResultText from 'components/ResultText'
import SortButton from 'components/SortButton'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import styles from './index.module.scss'
import classNames from 'classnames'

const cx = classNames.bind(styles)

const SearchArea = () => {
    const params = useParams<ParamTypes>()
    const scrollEle = useRef<HTMLDivElement | null>(null)

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

            <div>
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
