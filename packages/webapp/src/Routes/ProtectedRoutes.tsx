import LazyLoader from 'components/LazyLoader/LazyLoader'
import Page from 'components/Page'
import { Suspense } from 'react'
import { Switch } from 'react-router-dom'
import routes from './routes'

const ProtectedRoutes = () => (
    <Suspense fallback={<LazyLoader />}>
        <Switch>
            {routes.map(({ component: Component, path, exact, title }, i) => (
                <Page
                    title={title}
                    path={`/${path}`}
                    key={i}
                    exact={exact}
                    component={<Component />}
                />
            ))}
        </Switch>
    </Suspense>
)

export default ProtectedRoutes
