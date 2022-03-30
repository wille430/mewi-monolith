import PopUp from 'components/PopUp/PopUp'
import StyledLoader from 'components/StyledLoader'
import ArticleItemDetails from 'components/ArticleItemDetails/ArticleItemDetails'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { closeListing } from 'store/search/creators'

const ItemPopUp = () => {
    const { selectedListing } = useAppSelector((state) => state.search)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(closeListing())
    }

    return (
        <PopUp show={!!selectedListing} onOutsideClick={handleClose}>
            <div
                className='mx-auto'
                style={{
                    maxWidth: '800px',
                }}
            >
                {!selectedListing ? (
                    <div className='flex h-full w-full items-center justify-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <ArticleItemDetails onClose={handleClose} {...selectedListing} />
                )}
            </div>
        </PopUp>
    )
}

export default ItemPopUp
