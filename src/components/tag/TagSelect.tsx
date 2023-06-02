import React from 'react';
import {Select} from 'antd';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';

export interface props {
  className?: string;
  placeholder?: string;
  allowClear?: boolean;
  defaultValues?: any;
  value?: string[];
  onChange?: (tags: string[], word: any) => void;
  onClick?: (val: any) => void;
  disabled?: boolean;
}

const TagSelect = ({className, placeholder, defaultValues, onChange, onClick, value, allowClear, disabled}: props) => {
  return (
    <Select
      placeholder={placeholder}
      mode="tags"
      allowClear={allowClear}
      defaultValue={defaultValues}
      disabled={disabled}
      dropdownMatchSelectWidth={0}
      onClick={onClick}
      onChange={onChange}
      listHeight={0}
      dropdownClassName="d-none"
      className={className}
      value={!isNil(value) && isArray(value) ? value : undefined}
      defaultActiveFirstOption
      filterOption={false}
      getPopupContainer={(trigger) => trigger.parentNode}
    />
  );
};

export default TagSelect;
