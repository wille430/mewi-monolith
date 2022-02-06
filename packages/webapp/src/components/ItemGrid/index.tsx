import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/index'
import ItemPopUp from '../ItemPopUp'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getItem } from 'store/itemDisplay/creators'

const ItemGrid = () => {
    const search = useAppSelector((state) => state.search)
    const isLoading = useAppSelector(state => state.search.loading.searching)

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

    return (
        <section
            className='flex-grow'
            style={{
                minHeight: '50%',
            }}
        >
            {isLoading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <StyledLoader />
                </div>
            ) : (
                <div className='flex flex-wrap justify-center gap-4'>
                    {renderItems()}
                    <ItemPopUp />
                </div>
            )}
        </section>
    )
}

export default ItemGrid
