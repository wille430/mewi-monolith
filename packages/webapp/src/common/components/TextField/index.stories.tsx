import { Story, Meta } from '@storybook/react'
import TextField from './index'

export default {
    component: TextField,
    title: 'TextField',
} as Meta

const Template: Story = (args) => <TextField placeholder='Username' showClearButton={true} {...args} />

export const Primary = Template.bind({})
Primary.args = {}

