import {randomString} from "@mewi/utilities";
import {render} from "@testing-library/react";
import LabeledDropdown from "./LabeledDropdown";

it("renders correctly", () => {
    const mockOptions: { value: string; label: string }[] = [];
    const mockLabel = randomString(10);
    for (let i = 0; i < 10; i++) {
        const label = randomString(10);

        mockOptions.push({
            value: label,
            label: label,
        });
    }

    const {queryByTestId, queryByText} = render(
        <LabeledDropdown options={mockOptions} label={mockLabel} name={mockLabel}/>
    );

    const filterLabel = queryByText(mockLabel);
    const dropdown = queryByTestId("dropdownMenu");

    expect(filterLabel).toBeTruthy();
    expect(dropdown).toBeTruthy();
});
