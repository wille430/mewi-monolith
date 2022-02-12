import { ReactNode, useEffect } from 'react'
import { Route, RouteProps } from 'react-router-dom'

export interface PageProps extends Omit<RouteProps, 'component'> {
    title?: string
    component: ReactNode
}

const Page = ({ title, component, ...rest }: PageProps) => {
    // update title
    useEffect(() => {
        if (title && document.title !== title) {
            console.log('Changing', document.title, 'to', title)
            document.title = title
        }
    }, [title])

    return <Route {...rest} render={() => component} />
}

export default Page
