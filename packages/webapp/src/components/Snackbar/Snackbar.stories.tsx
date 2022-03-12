import { Story, Meta } from '@storybook/react'
import { AnimatePresence } from 'framer-motion'
import Snackbar from './Snackbar'

export default {
    component: Snackbar,
    title: 'Snackbar',
} as Meta

const Template: Story = (args) => (
    <AnimatePresence exitBeforeEnter>
        {args.open && (
            <Snackbar title='Title' body='body' autoHideDuration={5000} open={true} {...args} />
        )}
    </AnimatePresence>
)

export const Primary = Template.bind({})
Primary.args = {}
