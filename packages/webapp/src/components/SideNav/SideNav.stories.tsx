import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import SideNav from './SideNav'

export default {
    component: SideNav,
    title: 'Side Nav',
} as ComponentMeta<typeof SideNav>

const Template: ComponentStory<typeof SideNav> = () => (
    <MemoryRouter>
        <SideNav />
    </MemoryRouter>
)

export const Primary = Template.bind({})
Primary.args = {}
