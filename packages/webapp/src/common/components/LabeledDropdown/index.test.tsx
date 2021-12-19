import React from "react"
import { render, fireEvent } from "@testing-library/react"
import LabeledDropdown from './index'
import { stringUtils } from "@mewi/util"


it('renders correctly', () => {

    const mockOptions = []
    const mockLabel = stringUtils.randomString(10)
    for (let i = 0; i < 10; i++) {
        const label = stringUtils.randomString(10)
        
        mockOptions.push({
            value: label,
            label: label
        })
    }

    const { queryByTestId, queryByText } = render(
        <LabeledDropdown
            options={mockOptions}
            label={mockLabel}
            name={mockLabel}
        />
    )

    const filterLabel = queryByText(mockLabel)
    const dropdown = queryByTestId('dropdownMenu')

    expect(filterLabel).toBeTruthy()
    expect(dropdown).toBeTruthy()
})