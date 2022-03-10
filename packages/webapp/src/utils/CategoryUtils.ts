import { categories } from '@mewi/types'

export const findNestedCategory = (categoryToFind: string): string[] => {
    for (const i in categories) {
        for (const o in categories[i].subcat) {
            if (o === categoryToFind) {
                return [i, o]
            }
        }
    }

    return []
}
