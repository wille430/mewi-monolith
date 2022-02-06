import { Story, Meta } from '@storybook/react'
import { Button } from '../Button'
import { Modal } from './'

export default {
    component: Modal,
    title: 'Modal',
} as Meta

const Template: Story = (args) => <Modal {...args} />

export const Primary = Template.bind({})
Primary.args = {
    heading: 'Example modal',
    bodyText:
        'Elit commodo officia Lorem enim cupidatat incididunt aliquip et mollit consectetur in ut. Magna eu proident sit labore. Excepteur nisi mollit incididunt nostrud ea laboris duis enim minim culpa reprehenderit culpa. Aliqua nisi cupidatat deserunt laborum nostrud laborum magna. Excepteur do occaecat labore irure sit excepteur ea in tempor reprehenderit. Tempor tempor laborum nostrud incididunt magna sunt fugiat magna exercitation. Incididunt proident nulla laboris sint id et minim consequat non officia elit.',
    actions: [<Button label='Close' variant='text' />, <Button label='Accept' />],
}
