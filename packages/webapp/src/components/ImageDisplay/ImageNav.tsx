interface Props {
    imageUrls: string[]
    selectedIndex: number
    setSelectedIndex: (index: number) => void
}

const ImageNav = ({ imageUrls, selectedIndex, setSelectedIndex }: Props) => {
    return (
        <div className='absolute bottom-0 flex space-x-1 py-2 opacity-50'>
            {imageUrls.map((x, i) => (
                <div
                    className={`h-2 w-2 rounded-full ${
                        selectedIndex === i ? 'bg-green' : 'bg-gray-200'
                    }`}
                    onClick={(e) => setSelectedIndex(i)}
                />
            ))}
        </div>
    )
}

export default ImageNav
