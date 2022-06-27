import { Story, Meta } from '@storybook/react'
import uniqueId from 'lodash/uniqueId'
import ListingPopUp from './ListingPopUp'

export default {
    component: ListingPopUp,
    title: 'Listing Pop Up',
} as Meta

const Template: Story = (args) => (
    <ListingPopUp
        id={uniqueId()}
        title='Volvo 240'
        category={['fordon']}
        imageUrl={[]}
        isAuction={false}
        redirectUrl='https://blocket.se/'
        price={{
            value: 1000,
            currency: 'kr',
        }}
        region={'Göteborg'}
        origin='Blocket'
        body={
            'Har insett att jag inte kommer hinna med min 240 från 87 därför säljer jag av den. Är en del rost pån men absolut inte omöjlig att fixa till. Har aldrig kört me den själv utan bara provkört den lite här hemma o då verkar den gå fint men skulle nog behöva en översyn av tänddelar o lite bensin filter osv. Jäkligt fin inredning på bilen.'
        }
        parameters={[
            { id: uniqueId(), label: 'Bränsle', value: 'Bensin' },
            { id: uniqueId(), label: 'Växellåda', value: 'Manuell' },
            {
                id: uniqueId(),
                label: 'LONG STRING LONG STRING LONG STRING',
                value: 'ManuelldsadsasdassdadasdasdsdsadsadasdadasdasdsaVäxellådamanue;;amuiManuell',
            },
        ]}
        {...args}
    />
)

export const Primary = Template.bind({})
Primary.args = {}
