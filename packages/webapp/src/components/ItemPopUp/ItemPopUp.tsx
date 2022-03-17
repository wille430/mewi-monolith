import PopUp from 'components/PopUp/PopUp'
import StyledLoader from 'components/StyledLoader'
import ArticleItemDetails from 'components/ArticleItemDetails/ArticleItemDetails'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { clearItem } from 'store/itemDisplay/creators'

const ItemPopUp = () => {
    const itemDisplay = useAppSelector((state) => state.itemDisplay)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(clearItem())
    }

    console.log(itemDisplay.selectedItem)

    return (
        <PopUp show={!!itemDisplay.selectedItem} onOutsideClick={handleClose}>
            <div
                className='mx-auto'
                style={{
                    maxWidth: '800px',
                }}
            >
                {!itemDisplay.selectedItem ? (
                    <div className='flex h-full w-full items-center justify-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <ArticleItemDetails onClose={handleClose} {...itemDisplay.selectedItem} />
                )}
            </div>
        </PopUp>
    )
}

export default ItemPopUp
