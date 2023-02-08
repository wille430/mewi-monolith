import * as React from 'react'

interface IAdPlaceHolderProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const AdPlaceholder = (props: IAdPlaceHolderProps) => {
    let style = {
        height: '240px',
        width: '960px',
        minWidth: 'auto',
        maxHeight: 'auto',
    }

    const windowWidth = 1920 - 32

    switch (props.size) {
        case 'lg':
            style = {
                ...style,
                height: `${(240 * windowWidth) / 960}px`,
                maxHeight: '240px',
                width: '100%',
            }
            break
        case 'md':
        default:
            style = {
                ...style,
                height: '600px',
                width: '130px',
            }
            break
        case 'sm':
            style = {
                ...style,
                height: '240px',
                width: '960px',
            }
            break
    }
    return <canvas className={`bg-gray-400 ${props.className}`} style={style}/>
}

export default AdPlaceholder
