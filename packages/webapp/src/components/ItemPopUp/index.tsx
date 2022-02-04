import React from 'react'
import PopUp from 'components/PopUp/ index'
import StyledLoader from 'components/StyledLoader'
import ArticleItemDetails from 'components/ArticleItemDetails'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { clearItem } from 'store/itemDisplay/creators'

const ItemPopUp = () => {
    const itemDisplay = useAppSelector((state) => state.itemDisplay)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(clearItem())
    }

    return (
        <PopUp show={Boolean(itemDisplay.selectedItem)} onOutsideClick={handleClose}>
            <div
                className='mx-auto'
                style={{
                    maxWidth: '800px',
                }}
            >
                {!itemDisplay.selectedItem ? (
                    <div className='h-full w-full flex justify-center items-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <ArticleItemDetails {...itemDisplay.selectedItem} />
                )}
            </div>
        </PopUp>
    )
}

export default ItemPopUp
