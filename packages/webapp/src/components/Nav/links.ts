export const privateLinks = [
    {
        name: 'Mina Bevakningar',
        path: '/minabevakningar',
        styling: 'text-green-dark',
    },
]

export const publicLinks = [
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
