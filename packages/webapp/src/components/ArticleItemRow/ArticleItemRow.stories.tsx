import { IListing } from '@wille430/common'
import { generateMockIListing } from '@wille430/common'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ArticleItemRow from './ArticleItemRow'

export default {
    component: ArticleItemRow,
    title: 'Article Item Row',
} as ComponentMeta<typeof ArticleItemRow>

const Template: ComponentStory<typeof ArticleItemRow> = (args) => <ArticleItemRow {...args} />

export const Primary = Template.bind({})
Primary.args = {
    item: generateMockIListing(1) as IListing,
}
