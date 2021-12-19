import * as React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom'

interface Props {
    children: React.ReactNode
    isAuthenticated: boolean,
    [key: string]: any
}

const PublicRoute = ({ children, isAuthenticated, ...rest }: Props) => {
    return (
        <Route {...rest} render={() => (
            !isAuthenticated ? (children) : <Redirect to="/minabevakningar" />
        )} />
    )
}

export default PublicRoute