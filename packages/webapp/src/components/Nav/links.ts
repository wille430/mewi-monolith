import { Category } from '@wille430/common'
import { CategoryLabel } from '@wille430/common'
import { LinkProps } from 'next/link'
import { RootState } from '@/store'

export type NavLink = {
    label: string
    condition?: (state: RootState) => boolean | boolean
    sublinks?: NavLink[]
    className?: string
} & LinkProps

export const links: NavLink[] = [
    {
        label: 'Hem',
        href: '/',
    },
    {
        label: 'Om Oss',
        href: '#',
    },
    {
        label: 'Kategorier',
        href: '/kategorier',
        sublinks: Object.keys(Category).map((key) => ({
            label: CategoryLabel[key],
            href: `/sok?categories=${key}`,
        })),
    },
    {
        label: 'Logga In',
        href: '/loggain',
        className: 'text-green-400 md:ml-auto',
        condition: (state) => !state.user.isLoggedIn,
    },
    {
        label: 'Mina Sidor',
        href: '/minasidor',
        className: 'text-green-400 md:ml-auto',
        condition: (state) => state.user.isLoggedIn,
        sublinks: [
            {
                label: 'Mina Bevakningar',
                href: '/minasidor/bevakningar',
                className: 'text-white md:text-black',
            },
            {
                label: 'Mitt Konto',
                href: '/minasidor/konto',
                className: 'text-white md:text-black',
            },
            {
                label: 'Gillade Produkter',
                href: '/minasidor/gillade',
                className: 'text-white md:text-black',
            },
        ],
    },
]
