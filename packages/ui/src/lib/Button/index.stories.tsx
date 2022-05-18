import { Story, Meta } from '@storybook/react'
import { FiPlus } from 'react-icons/fi'
import { Button } from './index'

export default {
    component: Button,
    title: 'Button',
} as Meta

const Template: Story = (args) => <Button label='Button' {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'Button' }

export const ContainedWithIcon = Template.bind({})
ContainedWithIcon.args = {
    icon: <FiPlus />,
}

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
    variant: 'text',
}
export const TextWithIcon = Template.bind({})
TextWithIcon.args = {
    icon: <FiPlus />,
    variant: 'text',
}

export const TextDisabled = Template.bind({})
TextDisabled.args = {
    icon: <FiPlus />,
    variant: 'text',
    disabled: true,
}

export const Outlined = Template.bind({})
Outlined.args = {
    variant: 'outlined',
}

export const OutlinedWithIcon = Template.bind({})
OutlinedWithIcon.args = {
    icon: <FiPlus />,
    variant: 'outlined',
}

export const OutlinedDisabled = Template.bind({})
OutlinedDisabled.args = {
    icon: <FiPlus />,
    variant: 'outlined',
    disabled: true,
}

export const FullWidth = Template.bind({})
FullWidth.args = {
    fullWidth: true,
}

export const SecondaryColor = Template.bind({})
SecondaryColor.args = {
    color: 'secondary',
}
