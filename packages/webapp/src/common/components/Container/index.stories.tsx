import { Story, Meta } from '@storybook/react'
import Container  from './index'

export default {
    component: Container,
    title: 'Container',
} as Meta

const Template: Story = (args) => <Container {...args} />

export const Primary = Template.bind({})
Primary.args = {}
