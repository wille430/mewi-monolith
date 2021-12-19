import Checkbox, { CheckboxProps } from 'common/components/Checkbox/index';
import useParam from 'common/hooks/useParam';
import React, { useEffect } from 'react';

//  selectedByDefault, label, value, filterState 

interface Props extends CheckboxProps {
    name: string,
    selectedByDefault?: boolean,
    label: string
}

const FilterCheckbox = (props: Props) => {
    const { param, setParam } = useParam(props.name)

    useEffect(() => {
        if (props.selectedByDefault) {
            setParam(true)

            // { term: { [value]: true } }
        }
        // eslint-disable-next-line
    }, [])

    const onCheckboxChange = () => {
        setParam(!param)
    }

    return (
        <Checkbox onChange={onCheckboxChange} {...props} checked={Boolean(param) || false} />
    );
}

export default FilterCheckbox;