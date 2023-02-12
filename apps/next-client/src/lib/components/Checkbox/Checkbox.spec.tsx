import {randomString} from '@mewi/utilities'
import {render} from '@testing-library/react'
import Checkbox from './Checkbox'

it('renders correctly', () => {
    const mockLabel = randomString(5)

    const {queryByTestId, queryByText} = render(<Checkbox label={mockLabel}/>)

    expect(queryByText(mockLabel)).toBeTruthy()
    expect(queryByTestId('checkbox')).toBeTruthy()
})
