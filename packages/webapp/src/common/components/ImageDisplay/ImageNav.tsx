interface Props {
    imageUrls: string[]
    selectedIndex: number
    setSelectedIndex: Function
}

const ImageNav = ({ imageUrls, selectedIndex, setSelectedIndex }: Props) => {
    return (
        <div className='flex space-x-1 py-2 absolute bottom-0 opacity-50'>
            {imageUrls.map((x, i) => (
                <div
                    className={`rounded-full w-2 h-2 blur-sm ${
                        selectedIndex === i ? 'bg-green' : 'bg-gray-200'
                    }`}
                    onClick={(e) => setSelectedIndex(i)}
                />
            ))}
        </div>
    )
}

export default ImageNav
