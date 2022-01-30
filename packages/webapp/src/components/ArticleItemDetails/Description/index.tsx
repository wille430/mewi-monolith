const Description = ({ text }: { text: string }) => {
    const paragraphs = text.split('\n')

    return (
        <>
            {paragraphs.forEach((paragraph) => (
                <p>{paragraph}</p>
            ))}
        </>
    )
}

export default Description
