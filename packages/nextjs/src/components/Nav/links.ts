export const privateLinks: NavLink[] = [
    {
        name: 'Mina Bevakningar',
        path: '/minasidor/bevakningar',
        styling: 'text-green-dark',
        sublinks: [
            { name: 'Mitt Konto', path: '/minasidor/konto', styling: 'text-white', private: true },
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
    },
]

export default publicLinks.concat(privateLinks) as typeof privateLinks & typeof publicLinks
