import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef, useState } from 'react'

const DefaultImage = (
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [error, setError] = useState(false)
    const initialComponent = <img alt='' onError={() => setError(true)} {...props} />
    const component = useRef(initialComponent)

    useEffect(() => {
        if (error) {
            component.current = <div {...props} className={`bg-gray-400 ${props.className}`} />
        } else {
            component.current = initialComponent
        }
    }, [error])

    return component.current
}

export default DefaultImage
