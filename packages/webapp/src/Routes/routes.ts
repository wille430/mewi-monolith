import { PageProps } from 'components/Page'
import { lazy, LazyExoticComponent } from 'react'

const routes: (Omit<PageProps, 'component'> & {
    component: LazyExoticComponent<() => JSX.Element>
})[] = [
    {
        title: 'Mina bevakningar - Mewi.se',
        path: 'minabevakningar',
        component: lazy(() => import('Routes/Bevakningar')),
    },
    {
        title: 'Premium - Mewi.se',
        path: 'premium',
        component: lazy(() => import('Routes/PaymentPage')),
    },
    {
        title: 'Mitt Konto - Mewi.se',
        path: 'mittkonto',
        component: lazy(() => import('Routes/MyAccount/MyAccount')),
    },
]

export default routes
