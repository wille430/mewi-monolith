import { Story, Meta } from '@storybook/react'
import HorizontalLine from './index'

export default {
    component: HorizontalLine,
    title: 'HorizontalLine',
} as Meta

const Template: Story = (args) => <HorizontalLine {...args} />

export const Primary = Template.bind({})
Primary.args = {}
