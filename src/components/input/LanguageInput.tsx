import React from 'react';
import {useTranslation} from 'react-i18next';
import {ConfigProvider, Form, Input} from 'antd';
import {language} from 'types/general';
import filter from 'lodash/filter';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';

export interface pros {
  languages: any;
  data: any;
  keyProp: string;
  language: language;
  textArea?: boolean;
  required?: boolean;
}

const LanguageInput = ({languages, data, keyProp, language, textArea = false, required = true}: pros) => {
  const {t} = useTranslation('general');
  return languages
    ? languages?.map((langType: language, index: number) => {
        const initial = first(
          filter(data?.languages, (val: any) => val?.language === langType?.name && val?.key === keyProp)
        )?.value;
        return (
          <ConfigProvider direction={language?.direction}>
            <Form.Item
              name={['languages', keyProp, langType?.name]}
              key={index.toString()}
              label={language.name === 'fa' ? t(keyProp) : keyProp}
              initialValue={initial}
              normalize={(value) => (isEmpty(value) ? undefined : value)}
              hidden={language?.name !== langType?.name}
              rules={[{required: required && language?.name === langType?.name, message: t('messages.required')}]}>
              {textArea ? <Input.TextArea rows={1} dir={language?.direction} /> : <Input dir={language?.direction} />}
            </Form.Item>
          </ConfigProvider>
        );
      })
    : null;
};

export default LanguageInput;
