import { ComponentMeta, ComponentStory } from '@storybook/react'
import WatcherCard from './WatcherCard'
import mongoose from 'mongoose'
import { Provider } from 'react-redux'
import { store } from 'store'
import faker from '@faker-js/faker'
import { generateMockItemData } from '@mewi/util'
import { ItemData } from '@mewi/types'

export default {
    component: WatcherCard,
    title: 'Watcher Card',
} as ComponentMeta<typeof WatcherCard>

const Template: ComponentStory<typeof WatcherCard> = (args) => (
    <Provider store={store}>
        <WatcherCard {...args} />
    </Provider>
)

export const Primary = Template.bind({})
Primary.args = {
    watcher: {
        _id: new mongoose.Types.ObjectId().toString(),
        metadata: {
            keyword: faker.random.words(3),
        },
        createdAt: new Date().toString(),
        notifiedAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    newItems: generateMockItemData(5) as ItemData[],
}
