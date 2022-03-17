import { DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react'
import missingImage from 'assets/missingImage.png'

const DefaultImage = (
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [error, setError] = useState(true)
    return (
        <img
            alt=''
            onError={() => setError(true)}
            onLoad={(e) => e.currentTarget.src !== missingImage && setError(false)}
            {...props}
            src={error ? missingImage : props.src}
        />
    )
}

export default DefaultImage
