import { DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react'
import missingImage from 'assets/missingImage.png'

const DefaultImage = (
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [error, setError] = useState(false)
    return (
        <img
            alt=''
            onError={() => setError(true)}
            {...props}
            src={error || !props.src ? missingImage : props.src}
        />
    )
}

export default DefaultImage
