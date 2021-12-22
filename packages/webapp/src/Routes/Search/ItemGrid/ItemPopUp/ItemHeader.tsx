import { MouseEventHandler } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

const ItemHeader = ({ closePopUp }: { closePopUp: MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <div className='w-full bg-white sticky z-10 p-2 top-0'>
            <button onClick={closePopUp} className='block md:hidden'>
                <FiArrowLeft size='24' />
            </button>
        </div>
    )
}

export default ItemHeader
