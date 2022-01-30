import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/index'
import ItemPopUp from '../ItemPopUp'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getItem } from 'store/itemDisplay/creators'
import { useState } from 'react'

const ItemGrid = () => {
    const { hits } = useAppSelector((state) => state.search)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useAppDispatch()

    const handleItemClick = (id: string) => {
        setIsLoading(true)

        dispatch(getItem(id))
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
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
                <div className='flex justify-center items-center min-h-screen'>
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
