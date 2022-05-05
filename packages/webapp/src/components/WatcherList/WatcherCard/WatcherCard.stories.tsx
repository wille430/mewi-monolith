import { ComponentMeta, ComponentStory } from '@storybook/react'
import WatcherCard from './WatcherCard'
import mongoose from 'mongoose'
import { Provider } from 'react-redux'
import { store } from 'store'
import faker from '@faker-js/faker'
import { generateMockIListing } from '@wille430/common'
import { IListing } from '@wille430/common'

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
    newItems: generateMockIListing(5) as IListing[],
}
