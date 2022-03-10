import { ItemData } from '@mewi/types'
import { generateMockItemData } from '@mewi/util'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import ArticleItemRow from './ArticleItemRow'

export default {
    component: ArticleItemRow,
    title: 'Article Item Row',
} as ComponentMeta<typeof ArticleItemRow>

const Template: ComponentStory<typeof ArticleItemRow> = (args) => <ArticleItemRow {...args} />

export const Primary = Template.bind({})
Primary.args = {
    item: generateMockItemData(1) as ItemData,
}
