import React from 'react';
import {Select} from 'antd';
import {renderKey, renderLabel} from 'utils';
import map from 'lodash/map';
import isString from 'lodash/isString';
import {SelectTypeProps} from 'types/general';
import isFunction from 'lodash/isFunction';

export interface props {
  id?: string;
  alignDropDownTop?: boolean;
  label?: string | Array<string[]> | string[];
  renderCustomLabel?: (option: any) => string;
  keys?: string;
  defaultLabel?: string;
  className?: string;
  listHeight?: number;
  mode?: SelectTypeProps;
  hasAllOption?: boolean;
  placeholder?: string;
  dropDownWith?: number;
  loading?: boolean;
  allowClear?: boolean;
  data: any;
  defaultValues?: any;
  value?: any;
  onChange?: (val: any, i: any) => void;
  onClick?: (val: any) => void;
  disabled?: boolean;
}

const SimpleSelect = ({
  id,
  alignDropDownTop,
  label,
  renderCustomLabel,
  keys,
  defaultLabel,
  className,
  listHeight,
  mode,
  hasAllOption,
  placeholder,
  dropDownWith,
  data,
  loading,
  defaultValues,
  onChange,
  onClick,
  value,
  allowClear,
  disabled
}: props) => {
  const {Option} = Select;

  const chooseLabel = (item: object): string => {
    if (isFunction(renderCustomLabel)) return renderCustomLabel(item);
    return renderLabel(item, label);
  };

  return (
    <Select
      id={id}
      placeholder={placeholder}
      mode={mode}
      allowClear={allowClear}
      loading={loading}
      defaultValue={defaultValues}
      onChange={(val, option) => {
        if (onChange) {
          onChange(val, option);
        }
      }}
      onClick={onClick}
      disabled={disabled}
      dropdownAlign={
        alignDropDownTop
          ? {
              points: ['bl', 'tl'],
              offset: [0, -3],
              overflow: {
                adjustX: 0,
                adjustY: 0
              }
            }
          : {
              points: ['tl', 'bl'],
              offset: [0, 3],
              overflow: {
                adjustX: 3,
                adjustY: 0
              }
            }
      }
      className={className}
      value={value}
      listHeight={listHeight}
      defaultActiveFirstOption
      filterOption={false}
      dropdownMatchSelectWidth={dropDownWith}
      getPopupContainer={(trigger) => trigger.parentNode}>
      {map(data, (item: any, index: number) => (
        <Option
          disabled={
            hasAllOption &&
            ((value?.includes('all') && renderKey(item) !== 'all') ||
              (!value?.includes('all') && renderKey(item) === 'all' && value?.length > 0))
          }
          key={index.toString()}
          data={item}
          value={renderKey(item, keys)}>
          {isString(chooseLabel(item)) ? chooseLabel(item) : defaultLabel}
        </Option>
      ))}
    </Select>
  );
};

export default SimpleSelect;
