import { useAppDispatch } from 'hooks/hooks'
import { ReactNode, useEffect } from 'react'
import { Route, RouteProps, useHistory, useLocation } from 'react-router-dom'
import { loginUser } from 'store/auth/creators'

export interface PageProps extends Omit<RouteProps, 'component'> {
    title?: string
    component: ReactNode
}

const Page = ({ title, component, ...rest }: PageProps) => {
    const history = useHistory()
    const location = useLocation()

    const dispatch = useAppDispatch()

    // update title
    useEffect(() => {
        if (title && document.title !== title) {
            document.title = title
        }
    }, [title])

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        if (queryParams.has('access_token') && queryParams.has('refresh_token')) {
            dispatch(
                loginUser({
                    access_token: queryParams.get('access_token') as string,
                    refresh_token: queryParams.get('refresh_token') as string,
                })
            )

            queryParams.delete('access_token')
            queryParams.delete('refresh_token')

            history.replace({
                search: queryParams.toString(),
            })
        }
    }, [])

    return <Route {...rest} render={() => component} />
}

export default Page
