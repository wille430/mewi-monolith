import { useRef } from 'react'
import { useEffect } from 'react'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

const DefaultImage = ({
    src,
    ...props
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const imgRef = useRef<any>()

    const replaceImg = (e) => {
        e.target.onerror = null
        e.target.src = '/img/missingImage.png'
    }

    useEffect(() => {
        imgRef.current.src = src
    }, [])

    return <img ref={imgRef} onError={replaceImg} loading='lazy' {...props} />
}

export default DefaultImage
