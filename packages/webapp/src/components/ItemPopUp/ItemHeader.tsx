import { MouseEventHandler } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

const ItemHeader = ({ closePopUp }: { closePopUp: MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <div className='sticky top-0 z-10 w-full bg-white p-2'>
            <button onClick={closePopUp} className='block md:hidden'>
                <FiArrowLeft size='24' />
            </button>
        </div>
    )
}

export default ItemHeader
