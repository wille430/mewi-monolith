import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { createIUserWatcherFactory, createListingFactory } from '@mewi/prisma/factory'
import type { IListing } from '@wille430/common'
import WatcherCard from './WatcherCard'

export default {
    component: WatcherCard,
    title: 'Watcher Card',
} as ComponentMeta<typeof WatcherCard>

const Template: ComponentStory<typeof WatcherCard> = (args) => <WatcherCard {...args} />

const userWatcherFactory = createIUserWatcherFactory()
const listingFactory = createListingFactory()

export const Primary = Template.bind({})
Primary.args = {
    watcher: userWatcherFactory.build(),
    newItems: Array(5).fill(listingFactory.build()) as IListing[],
}
