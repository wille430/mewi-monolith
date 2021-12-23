import { Story, Meta } from '@storybook/react'
import Button from './index'
import { FiPlus } from 'react-icons/fi'

export default {
    component: Button,
    title: 'Button',
} as Meta

const Template: Story = (args) => <Button label='Button' {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'Button' }

export const Async = Template.bind({})
Async.args = {
    label: 'Send',
    onClick: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 2000)
        })
    },
}

export const Text = Template.bind({})
Text.args = {
    type: 'text',
}

export const Outlined = Template.bind({})
Outlined.args = {
    type: 'outlined',
}

export const ContainedWithIcon = Template.bind({})
ContainedWithIcon.args = {
    icon: <FiPlus />,
}

export const TextWithIcon = Template.bind({})
TextWithIcon.args = {
    icon: <FiPlus />,
    type: 'text',
}

export const OutlinedWithIcon = Template.bind({})
OutlinedWithIcon.args = {
    icon: <FiPlus />,
    type: 'outlined',
}

export const FullWidth = Template.bind({})
FullWidth.args = {
    fullWidth: true
}

export const SecondaryColor = Template.bind({})
SecondaryColor.args = {
    color: 'secondary'
}