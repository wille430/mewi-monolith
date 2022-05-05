import { useRef } from 'react'
import { useEffect } from 'react'
import { DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react'

const DefaultImage = ({
    src,
    ...props
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const [error, setError] = useState(false)
    const imgRef = useRef<any>()

    const replaceImg = (e) => {
        e.target.onerror = null
        e.target.src = '/img/missingImage.png'
    }

    useEffect(() => {
        imgRef.current.src = src
    }, [])

    return <img ref={imgRef} onError={replaceImg} {...props} />
}

export default DefaultImage
