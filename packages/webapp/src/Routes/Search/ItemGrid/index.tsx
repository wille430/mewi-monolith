import { useEffect, useState } from 'react'
import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/index'
import ItemPopUp from '../../../components/ItemPopUp'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { getSearchResults } from 'store/search/creators'
import { getItem } from 'store/itemDisplay/creators'

const ItemGrid = () => {
    const hits = useAppSelector((state) => state.search.hits)
    const isLoading = useAppSelector((state) => state.search.isLoading)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSearchResults())
    }, [])

    const handleItemClick = (id: string) => {
        dispatch(getItem(id))
    }

    const renderItems = () => {
        return hits.map((item: any, i: number) => (
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
                <div className='flex justify-center items-center min-h-full'>
                    <StyledLoader />
                </div>
            ) : (
                <div className='flex flex-wrap gap-4 justify-center'>
                    {renderItems()}
                    <ItemPopUp />
                </div>
            )}
        </section>
    )
}

export default ItemGrid
