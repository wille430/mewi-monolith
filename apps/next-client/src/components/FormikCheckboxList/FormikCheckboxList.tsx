import {useFormikContext} from "formik";
import {ListingSearchFilters} from "@/common/types/ListingSearchFilters";
import {CheckboxList} from "../CheckboxList/CheckboxList";
import {toggleElement} from "@/lib/utils/toggleFilters";
import {HTMLAttributes} from "react";

export const FormikCheckboxList = (
    props: HTMLAttributes<HTMLDivElement> & {
        options: { label?: string; value: any }[]
        name: string
    }
) => {
    const {name, options} = props;
    const {setValues, values} = useFormikContext<ListingSearchFilters>();

    return (
        <div {...props}>
            <CheckboxList
                list={options.map(({label, value}) => {
                    const isChecked = values[name]?.includes(value);

                    return {
                        value: value,
                        label: label,
                        checked: isChecked,
                        onClick: () => setValues(toggleElement(name, value, !isChecked)),
                    };
                })}
                prefix={name}
            />
        </div>
    );
};
