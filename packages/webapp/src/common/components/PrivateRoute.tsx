import * as React from 'react'
import { Redirect } from 'react-router'
import { Route } from 'react-router-dom'

interface Props {
    // component: React.ComponentType<RouteComponentProps<any>>,
    children: React.ReactNode
    isAuthenticated: boolean
    [key: string]: any
}

const PrivateRoute = ({ children, isAuthenticated, ...rest }: Props) => {
    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                        }}
                    />
                )
            }
        />
    )
}

export default PrivateRoute
