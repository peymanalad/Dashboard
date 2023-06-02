import React, {FC} from 'react';
import {Checkbox, Input, InputNumber} from 'antd';
import {useTranslation} from 'react-i18next';
import {itemElementType} from 'types/setting';
import isString from 'lodash/isString';
import first from 'lodash/first';
import split from 'lodash/split';
import {ColorPicker, CustomUpload, DateTimePicker, MultiSelectPaginate, SimpleSelect} from 'components';
import DatePicker from 'react-datepicker2';

interface props {
  type: itemElementType;
  value?: any;
  onChange?: (value: any) => void;
  params?: object;
  options?: any;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
}

const InputBuilder: FC<props> = ({type, options, label, value, onChange, params, checked, disabled}) => {
  const {t} = useTranslation('general');

  switch (type) {
    case 'string':
      return <Input value={value} onChange={onChange} disabled={disabled} />;
    case 'number':
      return (
        <InputNumber type="number" className="w-full ltr-input" value={value} onChange={onChange} disabled={disabled} />
      );
    case 'file':
      return (
        <CustomUpload
          className="d-flex justify-center items-center"
          mode={options?.mode}
          outPutKeys="url"
          typeFile={options?.type}
          disabled={disabled}
          type="configs"
          value={value}
          onChange={onChange}
        />
      );
    case 'dateTime':
      return <DateTimePicker value={value} onChange={onChange} />;
    case 'checkBox':
      return (
        <Checkbox checked={checked} onChange={onChange} disabled={disabled}>
          {label}
        </Checkbox>
      );
    case 'color':
      return <ColorPicker value={value} onChange={onChange} disabled={disabled} />;
    case 'select':
      if (isString(options?.data))
        return (
          <MultiSelectPaginate
            url={options?.data}
            mode={options?.mode}
            params={params}
            keyValue={options?.value}
            keyLabel={options?.label}
            renderCustomLabel={options?.renderLabel}
            disabled={disabled}
            value={value}
            onChange={onChange}
            urlName={first(split(options?.data, '/', 1)) || 'MultiSelectData'}
            allowClear
            showSearch
          />
        );
      return (
        <SimpleSelect
          keys={options?.value}
          label={options?.label}
          renderCustomLabel={options?.renderLabel}
          mode={options?.mode}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={t('all')}
          allowClear
          data={options?.data}
        />
      );
    default:
      return <Input.TextArea className="w-full" value={value} onChange={onChange} disabled={disabled} />;
  }
};

export default InputBuilder;
