import { Category } from '@mewi/prisma/index-browser'
import { CategoryLabel } from '@wille430/common'

export const privateLinks: NavLink[] = [
    {
        name: 'Mina Sidor',
        path: '/minasidor/bevakningar',
        styling: 'text-green-dark',
        sublinks: [
            {
                name: 'Mina Bevakningar',
                path: '/minasidor/bevakningar',
                styling: 'text-white',
                private: true,
            },
            { name: 'Mitt Konto', path: '/minasidor/konto', styling: 'text-white', private: true },
            {
                name: 'Gillade Produkter',
                path: '/minasidor/gillade',
                styling: 'text-white',
                private: true,
            },
        ],
    },
]

export type NavLink = {
    name: string
    path: string
    styling?: string
    private?: boolean
    sublinks?: NavLink[]
}

export const publicLinks: NavLink[] = [
    {
        name: 'Hem',
        path: '/',
    },
    {
        name: 'Om Oss',
        path: '#',
    },
    {
        name: 'Alla Kategorier',
        path: '/kategorier',
        sublinks: Object.keys(Category).map((key) => ({
            name: CategoryLabel[key],
            path: `/kategorier/${key.toLowerCase()}`,
        })),
    },
]

export default publicLinks.concat(privateLinks) as typeof privateLinks & typeof publicLinks
