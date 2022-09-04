import { Category } from '@mewi/prisma/index-browser'
import omit from 'lodash/omit'
import { useRouter } from 'next/router'
import queryString from 'query-string'

export const navigateToCategoryUrl = (key: Category) => {
    const router = useRouter()

    return `/kategorier/${key.toLowerCase()}?${queryString.stringify(
        omit(router.query, ['category', 'page'])
    )}`
}
