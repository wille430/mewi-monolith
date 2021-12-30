import { useContext, useEffect, useState } from 'react'
import StyledLoader from 'common/components/StyledLoader'
import ArticleItem from 'common/components/ArticleItem/index'
import ItemPopUp from './ItemPopUp'
import { SelectedItemContext } from './ItemPopUp/SelectedItemContext'
import { useAppSelector } from 'common/hooks/hooks'
import { useDispatch } from 'react-redux'
import { getSearchResults } from 'store/search/creators'

const ItemGrid = () => {
    const hits = useAppSelector((state) => state.search.hits)
    const isLoading = useAppSelector((state) => state.search.isLoading)

    const dispatch = useDispatch()

    const [popUpState, setPopUpState] = useState({
        show: false,
        id: '',
    })
    const { item, setItem } = useContext(SelectedItemContext)

    useEffect(() => {
        dispatch(getSearchResults())
    }, [])

    useEffect(() => {
        if (item) {
            setPopUpState((prevState) => ({ ...prevState, show: true }))
        }
    }, [item])

    const handleItemClick = (id: string) => {
        setPopUpState({
            show: true,
            id: id,
        })
        setItem(id)
    }

    const renderItems = () => {
        return hits.map((item: any, i: number) => (
            <ArticleItem
                key={i}
                props={item['_source']}
                id={item['_id']}
                onClick={(e: Event) => handleItemClick(item['_id'])}
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
                    <ItemPopUp usePopUpState={[popUpState, setPopUpState]} />
                </div>
            )}
        </section>
    )
}

export default ItemGrid
