import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef, useState } from 'react'
import missingImage from 'assets/missingImage.png'

const DefaultImage = (
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [error, setError] = useState(false)
    const initialComponent = <img alt='' onError={() => setError(true)} {...props} />
    const component = useRef(initialComponent)

    useEffect(() => {
        if (error) {
            component.current = <img alt='' {...props} src={missingImage} />
        } else {
            component.current = initialComponent
        }
    }, [error])

    return component.current
}

export default DefaultImage
