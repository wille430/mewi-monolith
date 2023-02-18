import { Button } from '../Button/Button'
import { Modal, ModalProps } from '../Modal/Modal'
import { PopUp } from '../PopUp/PopUp'

export interface PopUpModalProps extends ModalProps {
    open?: boolean
    onExit?: () => void
    onAccept?: () => void
}

export const PopUpModal = ({ open, onExit, onAccept, ...rest }: PopUpModalProps) => (
    <PopUp show={Boolean(open)} onOutsideClick={onExit}>
        <div className='jusitfy-center pointer-events-none flex h-3/4 w-full items-center'>
            <div className='pointer-events-auto mx-auto'>
                <Modal
                    {...rest}
                    actions={
                        <>
                            <Button
                                key=''
                                onClick={onExit}
                                data-testid='modalDecline'
                                className="btn-outlined"
                            >
                                Nej
                            </Button>
                            <Button onClick={onAccept} data-testid='modalAccept' >
                                Ja
                            </Button>
                            {rest.actions}
                        </>
                    }
                />
            </div>
        </div>
    </PopUp>
)
