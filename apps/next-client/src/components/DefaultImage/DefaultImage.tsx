import { useRef, useEffect } from 'react'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

const DefaultImage = ({
    src,
    ...props
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const imgRef = useRef<any>()

    const replaceImg = (e: any) => {
        e.target.onerror = null
        e.target.src = '/img/missingImage.png'
    }

    useEffect(() => {
        imgRef.current.src = src
    }, [src])

    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={imgRef} onError={replaceImg} loading='lazy' {...props} />
}

export default DefaultImage
