import type { ComponentMeta, ComponentStory } from '@storybook/react'
import EditableField from './EditableField'

export default {
    component: EditableField,
    title: 'Editable Field',
} as ComponentMeta<typeof EditableField>

const Template: ComponentStory<typeof EditableField> = (args) => <EditableField {...args} />

export const Primary = Template.bind({})
Primary.args = {
    label: 'Email',
    value: '123',
}
