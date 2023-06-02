import React, {useState} from 'react';
import {Select, TimePicker} from 'antd';
import {convertTimeToUTC} from 'utils';
import isEmpty from 'lodash/isEmpty';

export interface props {
  id?: string;
  className?: string;
  placeholder?: string;
  dropDownWith?: number;
  allowClear?: boolean;
  defaultValues?: any;
  value?: any;
  onChange?: (times: string[]) => void;
  onClick?: (val: any) => void;
  disabled?: boolean;
}

const MultiSelectTime = ({id, className, placeholder, defaultValues, onChange, value, allowClear, disabled}: props) => {
  const [open, setOpen] = useState<boolean>(false);

  const onSelect = (time: any) => {
    if (onChange) {
      const timeData: string = convertTimeToUTC(time, 'HH:MM');
      const newValue: string[] = isEmpty(value) ? [timeData] : [...value, timeData];
      setOpen(false);
      onChange(newValue);
    }
  };

  return (
    <>
      <Select
        id={id}
        placeholder={placeholder}
        mode="tags"
        allowClear={allowClear}
        defaultValue={defaultValues}
        disabled={disabled}
        dropdownMatchSelectWidth={0}
        onClick={() => {
          setOpen(true);
        }}
        listHeight={0}
        dropdownClassName="d-none"
        className={className}
        value={value}
        defaultActiveFirstOption
        filterOption={false}
        getPopupContainer={(trigger) => trigger.parentNode}
      />
      <TimePicker className="w-0 h-0 p-0 border-0" open={open} format="HH:mm" onSelect={onSelect} />
    </>
  );
};

export default MultiSelectTime;
