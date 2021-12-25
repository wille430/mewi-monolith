import React, { useEffect, useContext } from 'react'
import PopUp from 'common/components/PopUp'
import StyledLoader from 'common/components/StyledLoader'
import ItemInfo from './ItemInfo'
import ItemHeader from './ItemHeader'
import { SelectedItemContext } from './SelectedItemContext'
import ArticleItemDetails from 'common/components/ArticleItemDetails'

const ItemPopUp = ({ usePopUpState }: { usePopUpState: [any, Function] }) => {
    const [popUpState, setPopUpState] = usePopUpState
    const { item, setItem } = useContext(SelectedItemContext)

    useEffect(() => {
        if (popUpState.show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        // eslint-disable-next-line
    }, [popUpState.show])

    const hidePopUp = (e: Event) => {
        if (e.target === e.currentTarget) {
            setPopUpState({
                id: null,
                show: !popUpState.show,
            })
            setItem(null)
        }
    }

    const closePopUp = () => {
        setPopUpState({
            id: null,
            show: !popUpState.show,
        })
        setItem(null)
    }

    return (
        <PopUp show={popUpState.show} onOutsideClick={hidePopUp}>
            <div
                className='mx-auto'
                style={{
                    maxWidth: '800px',
                }}
            >
                {!item ? (
                    <div className='h-full w-full flex justify-center items-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <ArticleItemDetails {...item} />
                )}
            </div>
        </PopUp>
    )
}

export default ItemPopUp
