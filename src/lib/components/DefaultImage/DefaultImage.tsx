import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

const DefaultImage = ({ src, ...props }: ImageProps) => {
    const [realSrc, setSrc] = useState(src)

    const replaceImg = () => {
        setSrc('/img/missingImage.png')
    }

    // TODO: use next Image
    return <Image {...props} src={realSrc} onError={replaceImg} />
}

export default DefaultImage
