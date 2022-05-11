import { createListingFactory } from '@mewi/prisma/factory'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ListingRow } from './ListingRow'

export default {
    component: ListingRow,
    title: 'Article Item Row',
} as ComponentMeta<typeof ListingRow>

const Template: ComponentStory<typeof ListingRow> = (args) => <ListingRow {...args} />

const listingFactory = createListingFactory()

export const Primary = Template.bind({})
Primary.args = {
    item: listingFactory.create(),
}
