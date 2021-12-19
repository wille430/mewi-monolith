import React from "react"
import { fireEvent, render } from '@testing-library/react'
import Checkbox from './index'
import { stringUtils } from "@mewi/util"

it('renders correctly', () => {

    const mockLabel = stringUtils.randomString(5)

    const { queryByTestId, queryByText } = render(<Checkbox label={mockLabel} />)

    expect(queryByText(mockLabel)).toBeTruthy()
    expect(queryByTestId('checkbox')).toBeTruthy()
})

describe('Checkbox', () => {
    it('should trigger on change function', () => {
        const mockOnChange = jest.fn()
        const { queryByTestId } = render(<Checkbox onChange={mockOnChange} />)

        const checkbox = queryByTestId('checkbox')
        if (!checkbox) throw new Error('Checkbox is undefined')

        fireEvent.click(checkbox)

        expect(mockOnChange).toHaveBeenCalled()
    })
})