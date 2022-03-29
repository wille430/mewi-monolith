import PopUp from 'components/PopUp/PopUp'
import StyledLoader from 'components/StyledLoader'
import ArticleItemDetails from 'components/ArticleItemDetails/ArticleItemDetails'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { closeListing } from 'store/search/creators'
import { IListing } from '@mewi/common/types'

const ItemPopUp = () => {
    const { selectedListingId, hits } = useAppSelector((state) => state.search)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(closeListing())
    }

    return (
        <PopUp show={!!hits.find((x) => x.id === selectedListingId)} onOutsideClick={handleClose}>
            <div
                className='mx-auto'
                style={{
                    maxWidth: '800px',
                }}
            >
                {!selectedListingId ? (
                    <div className='flex h-full w-full items-center justify-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <ArticleItemDetails
                        onClose={handleClose}
                        {...(hits.find((x) => x.id === selectedListingId) as IListing)}
                    />
                )}
            </div>
        </PopUp>
    )
}

export default ItemPopUp
