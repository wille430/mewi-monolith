import {
    ComponentType,
    DetailedHTMLProps,
    HTMLAttributes,
    ImgHTMLAttributes,
    useEffect,
    useRef,
    useState,
} from 'react'

const checkForError = <
    P extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & object
>(
    WrappedComponent: ComponentType<P>
) => {
    return () => {
        const [error, setError] = useState(true)

        if (error) {
            return <div {...(WrappedComponent.defaultProps as P)}>Error</div>
        }

        return (
            <div className={WrappedComponent.defaultProps?.className}>
                <WrappedComponent
                    {...(WrappedComponent.defaultProps as P)}
                    onError={() => setError(true)}
                />
            </div>
        )
    }
}

const DefaultImage = (
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [error, setError] = useState(false)
    const component = useRef(<img alt='' onError={() => setError(true)} {...props} />)

    useEffect(() => {
        component.current = <div {...props} className={`bg-gray-400 ${props.className}`} />
    }, [error])

    return component.current
}

export default DefaultImage
