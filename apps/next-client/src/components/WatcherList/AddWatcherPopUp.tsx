import { Container } from "../Container/Container";
import { HorizontalLine } from "../HorizontalLine/HorizontalLine";
import { PopUp } from "@/components/PopUp/PopUp";
import { CreateWatcherForm } from "./CreateWatcherForm/CreateWatcherForm";

const AddWatcherPopUp = ({ useShow }: any) => {
    const { show, setShow } = useShow;

    const hidePopUp = () => {
        setShow(false);
    };

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className='p-2 sm:mt-32'>
                <Container className='max-w-4xl sm:mx-auto' data-testid='addWatcherPopUp'>
                    <h3>Lägg till en bevakning</h3>
                    <HorizontalLine />

                    <CreateWatcherForm
                        className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'
                        onSuccess={() => setShow(false)}
                    />
                </Container>
            </div>
        </PopUp>
    );
};

export default AddWatcherPopUp;
