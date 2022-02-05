import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/index'
import ItemPopUp from '../ItemPopUp'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getItem } from 'store/itemDisplay/creators'
import { useEffect, useState } from 'react'
import { getSearchResults } from 'store/search/creators'

const ItemGrid = () => {
    const search = useAppSelector((state) => state.search)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useAppDispatch()

    const handleItemClick = (id: string) => {
        dispatch(getItem(id))
    }

    useEffect(() => {
        setIsLoading(true)
        // get new results
        dispatch(getSearchResults())
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [search.filters, search.page, search.sort])

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
