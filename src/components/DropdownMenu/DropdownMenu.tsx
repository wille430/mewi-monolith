import makeAnimated from "react-select/animated";
import Select from "react-select";
import type { HTMLAttributes } from "react";

export interface DropDownMenuProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name: string;
  options: {
    value: string;
    label: string;
    [key: string]: any;
  }[];
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  onChange?: (value: any) => void;
  value?: string | string[] | null;
}

const DropdownMenu = ({
  label,
  options,
  isMulti,
  closeMenuOnSelect,
  onChange,
  value,
  ...rest
}: DropDownMenuProps) => {
  const animatedComponents = makeAnimated();

  const onDropdownChange = (
    value:
      | { value: string; label: string }
      | { value: string; label: string }[],
    action: string
  ): void => {
    if (Array.isArray(value)) {
      switch (action) {
        case "remove-value":
        case "pop-value":
          const values = value.map((option) => option.value);
          if (Boolean(value) || Array.isArray(value)) {
            const arrayOfSelectedValues = values.filter((val) =>
              values?.includes(val)
            );
            onChange && onChange(arrayOfSelectedValues);
          }
          break;
        case "clear":
          onChange && onChange([]);
          break;
        default:
      }
      onChange && onChange(value.map((x) => x.value));
    } else {
      switch (action) {
        case "remove-value":
        case "pop-value":
        case "clear":
          onChange && onChange(null);
          break;
        default:
      }
      onChange && onChange(value.value);
    }
  };

  return (
    <div className="text-black" {...rest}>
      <Select
        value={options.filter((option) => value?.includes(option.value))}
        classNamePrefix={"Select"}
        options={options}
        closeMenuOnSelect={closeMenuOnSelect}
        isMulti={isMulti}
        components={animatedComponents}
        // @ts-ignore
        onChange={onDropdownChange}
        palceholder={<span className="select-placeholder-text">{label}</span>}
      />
    </div>
  );
};

export default DropdownMenu;
