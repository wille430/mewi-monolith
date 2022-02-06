import { Modal, Button } from '@mewi/ui'
import PopUp from 'components/PopUp/ index'

interface CreateWatcherConfirmationModalProps {
    open?: boolean
    onExit?: () => void
    onAccept?: () => void
}

const CreateWatcherConfirmationModal = ({
    open,
    onExit,
    onAccept,
}: CreateWatcherConfirmationModalProps) => {
    return (
        <PopUp show={Boolean(open)} onOutsideClick={onExit}>
            <div className='jusitfy-center flex h-3/4 w-full items-center'>
                <Modal
                    heading='Är du säker att du vill lägga en bevakning på sökningen?'
                    bodyText='Genom att klicka på "Ja" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.'
                    actions={[
                        <Button label='Nej' variant='text' onClick={onExit} />,
                        <Button label='Ja' onClick={onAccept} />,
                    ]}
                />
            </div>
        </PopUp>
    )
}

export default CreateWatcherConfirmationModal
