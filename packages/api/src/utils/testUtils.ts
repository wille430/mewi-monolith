import faker from '@faker-js/faker'
import { categories, ItemData } from '@mewi/types'
import _ from 'lodash'

export const generateMockItemData = (count = 1): ItemData | ItemData[] => {
    const items: ItemData[] = []
    for (const i in Array(count).keys()) {
        items.push({
            _id: faker.datatype.uuid(),
            title: faker.random.words(5),
            category: [_.sample(categories)._id],
            imageUrl: [faker.internet.url()],
            isAuction: faker.datatype.boolean(),
            redirectUrl: faker.internet.url(),
            region: faker.address.cityName(),
            origin: 'Tradera',
        })
    }

    if (items.length > 1) {
        return items
    } else {
        return items[0]
    }
}
