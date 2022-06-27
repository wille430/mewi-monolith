import { ComponentMeta, ComponentStory } from '@storybook/react'
import SideNav from './SideNav'

export default {
    component: SideNav,
    title: 'Side Nav',
} as ComponentMeta<typeof SideNav>

const Template: ComponentStory<typeof SideNav> = () => <SideNav />

export const Primary = Template.bind({})
Primary.args = {}
