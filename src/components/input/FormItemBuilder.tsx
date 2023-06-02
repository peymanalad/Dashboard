import React, {FC} from 'react';
import {Col, Form} from 'antd';
import {itemElementProps} from 'types/setting';
import {InputBuilder} from 'components';
import concat from 'lodash/concat';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';

interface props {
  name: string | string[];
  listName?: string | string[];
  index?: string;
  form?: any;
  elementDetail: itemElementProps;
  initialValue?: any;
  showLabel?: boolean;
  className?: string;
}

const FormItemBuilder: FC<props> = ({
  name,
  listName = [],
  elementDetail,
  initialValue,
  showLabel,
  className,
  form,
  index = []
}) => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, nextValues) =>
        reduce(
          elementDetail?.dependencies,
          (result: boolean, dependency: string | string[]) =>
            result ||
            get(prevValues, concat(listName, index, dependency)) !==
              get(nextValues, concat(listName, index, dependency)),
          false
        )
      }>
      {() => {
        return (
          <Col className={className} flex={`0 0 ${elementDetail?.size * 100}%`}>
            <Form.Item
              name={name}
              label={showLabel && elementDetail?.type !== 'checkBox' && elementDetail?.title}
              valuePropName={elementDetail?.type === 'checkBox' ? 'checked' : undefined}
              initialValue={initialValue}
              className={`${elementDetail?.type === 'select' ? 'w-full' : ''} w-full ${
                !showLabel || elementDetail?.type === 'checkBox' ? 'm-0' : ''
              }`}
              fieldKey={name}>
              <InputBuilder
                label={showLabel ? elementDetail?.title : undefined}
                type={elementDetail?.type}
                options={elementDetail?.options}
                params={
                  isFunction(get(elementDetail, ['options', 'params']))
                    ? get(elementDetail, ['options', 'params'])(
                        map(elementDetail?.dependencies, (dependency: string | string[]) =>
                          get(form.getFieldsValue(), concat(listName, index, dependency))
                        )
                      )
                    : get(elementDetail, ['options', 'params'])
                }
                disabled={
                  isFunction(elementDetail?.disabled)
                    ? elementDetail?.disabled(
                        map(elementDetail?.dependencies, (dependency: string | string[]) =>
                          get(form.getFieldsValue(), concat(listName, index, dependency))
                        )
                      )
                    : elementDetail?.disabled
                }
              />
            </Form.Item>
          </Col>
        );
      }}
    </Form.Item>
  );
};

export default FormItemBuilder;
