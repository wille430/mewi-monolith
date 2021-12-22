import { lazy } from 'react'

const routes = [
    {
        path: 'minabevakningar',
        component: lazy(() => import('Routes/Bevakningar')),
        exact: true,
    },
    {
        path: 'premium',
        component: lazy(() => import('Routes/PaymentPage')),
        exact: true,
    },
]

export default routes
