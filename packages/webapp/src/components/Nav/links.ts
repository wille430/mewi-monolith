export const privateLinks: NavLink[] = [
    {
        name: 'Mina Bevakningar',
        path: '/minabevakningar',
        styling: 'text-green-dark',
        sublinks: [{ name: 'Mitt Konto', path: '/mittkonto', styling: 'text-white' }],
    },
]

export type NavLink = {
    name: string
    path: string
    styling?: string
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
