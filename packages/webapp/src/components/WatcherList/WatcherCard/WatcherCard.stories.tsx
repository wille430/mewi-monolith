import { ComponentMeta, ComponentStory } from '@storybook/react'
import { createUserWatcherFactory, createListingFactory } from '@mewi/prisma/factory'
import { Listing } from '@mewi/prisma'
import WatcherCard from './WatcherCard'

export default {
    component: WatcherCard,
    title: 'Watcher Card',
} as ComponentMeta<typeof WatcherCard>

const Template: ComponentStory<typeof WatcherCard> = (args) => <WatcherCard {...args} />

const userWatcherFactory = createUserWatcherFactory()
const listingFactory = createListingFactory()

export const Primary = Template.bind({})
Primary.args = {
    watcher: userWatcherFactory.build(),
    newItems: Array(5).fill(listingFactory.build()) as Listing[],
}
