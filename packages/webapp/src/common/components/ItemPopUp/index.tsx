import React, { useEffect, useContext } from 'react'
import PopUp from 'common/components/PopUp'
import StyledLoader from 'common/components/StyledLoader'
import ArticleItemDetails from 'common/components/ArticleItemDetails'
import { useAppSelector } from 'common/hooks/hooks'
import { useDispatch } from 'react-redux'
import { clearItem } from 'store/itemDisplay/creators'

const ItemPopUp = () => {

    const itemDisplay = useAppSelector(state => state.itemDisplay)
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
