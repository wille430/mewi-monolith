import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FiArrowLeft, FiArrowRight, FiImage } from 'react-icons/fi'
import { Carousel } from 'react-responsive-carousel'
import ImageNav from './ImageNav'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import DefaultImage from 'components/DefaultImage/DefaultImage'

const ImageDisplay = ({ imageUrls }: { imageUrls: string[] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const ImageArrowNavigation = () => {
        const transition = 'transition duration-200 ease-in-out'
        const className =
            'w-12 h-12 hover:bg-gray-400 hover:bg-opacity-40 flex justify-center items-center rounded-full ' +
            transition

        const OffsetSelected = (amount: number) => {
            if (selectedIndex + amount > imageUrls.length - 1) {
                setSelectedIndex(0)
            } else if (selectedIndex + amount < 0) {
                setSelectedIndex(imageUrls.length - 1)
            } else {
                setSelectedIndex(selectedIndex + amount)
            }
        }

        return (
            <div className='absolute flex h-full w-full items-center justify-between p-6'>
                <button className={className} onClick={(e) => OffsetSelected(-1)}>
                    <FiArrowLeft />
                </button>
                <button className={className} onClick={(e) => OffsetSelected(1)}>
                    <FiArrowRight />
                </button>
            </div>
        )
    }

    const renderImageDisplay = () => {
        if (isMobile) {
            if (imageUrls.length > 0) {
                return (
                    <Carousel className='h-full overflow-y-hidden'>
                        {imageUrls.map((imageUrl) => (
                            <div>
                                <DefaultImage
                                    className='h-full object-contain'
                                    src={imageUrl}
                                    alt={imageUrl}
                                />
                            </div>
                        ))}
                    </Carousel>
                )
            }
            return (
                <div className='flex h-full items-center'>
                    <FiImage size='50' color='lightgray' style={{ height: '500px' }} />
                </div>
            )
        } else {
            return (
                <div className='relative flex w-full flex-1 justify-center'>
                    <div style={{ height: '500px' }}>
                        {imageUrls[selectedIndex] ? (
                            <DefaultImage
                                className='h-full object-contain'
                                src={imageUrls[selectedIndex]}
                                alt={imageUrls[selectedIndex]}
                            />
                        ) : (
                            <div className='flex h-full items-center'>
                                <FiImage size='50' color='lightgray' />
                            </div>
                        )}
                    </div>
                    <ImageArrowNavigation />
                    <ImageNav {...{ selectedIndex, imageUrls, setSelectedIndex }} />
                </div>
            )
        }
    }

    return renderImageDisplay()
}

export default ImageDisplay
