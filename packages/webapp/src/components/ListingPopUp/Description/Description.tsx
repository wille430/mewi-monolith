const Description = ({ text }: { text: string }) => {
    const paragraphs = text.split('\n')

    if (text.length) {
        return (
            <div className='space-y-6'>
                {paragraphs.map((paragraph) => (
                    <p>{paragraph}</p>
                ))}
            </div>
        )
    } else {
        return <span className='text-gray-600 text-sm'>Produkten saknar beskrivning</span>
    }
}

export default Description
