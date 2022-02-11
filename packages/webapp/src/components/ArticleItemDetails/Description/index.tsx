
const Description = ({ text }: { text: string }) => {
    const paragraphs = text.split('\n')

    return (
        <div className='space-y-6'>
            {paragraphs.map((paragraph) => (
                <p>{paragraph}</p>
            ))}
        </div>
    )
}

export default Description
