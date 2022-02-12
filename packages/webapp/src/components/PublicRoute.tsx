import * as React from 'react'
import { Redirect } from 'react-router'
import Page, { PageProps } from './Page'

interface Props extends PageProps {
    isAuthenticated: boolean
}

const PublicRoute = ({ isAuthenticated, component, ...rest }: Props) => {
    return (
        <Page
            {...rest}
            component={!isAuthenticated ? component : <Redirect to='/minabevakningar' />}
        />
    )
}

export default PublicRoute
