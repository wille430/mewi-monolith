import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

const Description = ({ text }: { text: string }) => {
    const [readMore, setReadMore] = useState(false)
    const [isOverflowing, setOverflow] = useState(false)
    const textRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
        if (textRef.current) {
            setOverflow(
                textRef.current.clientWidth < textRef.current.scrollWidth ||
                    textRef.current.clientHeight < textRef.current.scrollHeight
            )
        }
    }, [text])

    if (text.length) {
        return (
            <div>
                <p
                    className={clsx(
                        'text-sm text-gray-800 text-ellipsis overflow-hidden leading-6',
                        !readMore ? 'max-h-40' : ''
                    )}
                    ref={textRef}
                >
                    {text.split('\n').map((x) => {
                        return (
                            <>
                                {x}
                                <br />
                            </>
                        )
                    })}
                </p>
                <div className='pt-2 text-primary'>
                    {readMore ? (
                        <button onClick={() => setReadMore(false)}>Stäng</button>
                    ) : (
                        isOverflowing && (
                            <button onClick={() => setReadMore(true)}>Läs mer...</button>
                        )
                    )}
                </div>
            </div>
        )
    } else {
        return <span className='text-gray-600 text-sm'>Produkten saknar beskrivning</span>
    }
}

export default Description
