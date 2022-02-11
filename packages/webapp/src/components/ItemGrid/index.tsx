import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/index'
import ItemPopUp from '../ItemPopUp'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getItem } from 'store/itemDisplay/creators'
import styles from './index.module.scss'
import classNames from 'classnames'

const cx = classNames.bind(styles)

const ItemGrid = () => {
    const search = useAppSelector((state) => state.search)
    const status = useAppSelector((state) => state.search.status.searching)
    const { totalHits } = useAppSelector((state) => state.search)

    const dispatch = useAppDispatch()

    const handleItemClick = (id: string) => {
        dispatch(getItem(id))
    }

    const renderItems = () => {
        return search.hits.map((item: any, i: number) => (
            <ArticleItem
                key={i}
                props={item['_source']}
                id={item['_id']}
                onClick={() => handleItemClick(item['_id'])}
            />
        ))
    }

    if (status === 'loading') {
        return (
            <section
                className={cx({
                    [styles.center]: true,
                })}
            >
                <StyledLoader />
            </section>
        )
    } else if (status === 'complete') {
        if (totalHits > 0) {
            return (
                <section
                    className={cx({
                        [styles.grid]: true,
                    })}
                >
                    {renderItems()}
                    <ItemPopUp />
                </section>
            )
        } else {
            return (
                <section className={cx({ [styles.center]: true })}>
                    <span>Inga resultat hittades för din sökning.</span>
                </section>
            )
        }
    } else {
        return (
            <section className={cx({ [styles.center]: true })}>
                <span>Ett fel inträffade</span>
            </section>
        )
    }
}

export default ItemGrid
