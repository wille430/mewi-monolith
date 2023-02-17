import { ReactNode, useState } from 'react'
import { PopUpModal, PopUpModalProps } from '../PopUpModal/PopUpModal'

export type ConfirmModalProps = {
    children: (args: { showModal: () => void; hideModal: () => void }) => ReactNode
    modalProps: PopUpModalProps
}

export const ConfirmModal = (props: ConfirmModalProps) => {
    const {
        children,
        modalProps: { onAccept, ...modalProps },
    } = props
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {children({
                hideModal: () => setShowModal(false),
                showModal: () => setShowModal(true),
            })}
            <PopUpModal
                onAccept={() => {
                    setShowModal(false)
                    onAccept && onAccept()
                }}
                onExit={() => setShowModal(false)}
                open={showModal}
                {...modalProps}
            />
        </>
    )
}
