import { Story, Meta } from '@storybook/react'
import Snackbar from './Snackbar'

export default {
    component: Snackbar,
    title: 'Snackbar',
} as Meta

const Template: Story = (args) => (
    <Snackbar title='Title' body='body' autoHideDuration={5000} open={true} />
)

export const Primary = Template.bind({})
Primary.args = {}
