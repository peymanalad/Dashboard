import React, {FC, useMemo} from 'react';
import {Row, Divider} from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';
import {GroupInput, FormItemBuilder} from 'components/index';
import concat from 'lodash/concat';
import without from 'lodash/without';
import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import sum from 'lodash/sum';
import toNumber from 'lodash/toNumber';
import update from 'lodash/update';
import cloneWith from 'lodash/cloneWith';
import isFunction from 'lodash/isFunction';
import {reorderList} from 'utils';
import {itemElementProps} from 'types/setting';

export interface Props {
  name: any;
  listName?: string | string[];
  index?: string;
  data: itemElementProps;
  form?: any;
  initialValues?: any;
  showLabel?: boolean;
  className?: string;
}

const FormBuilder: FC<Props> = ({name, data, initialValues, showLabel, className, form, listName, index}) => {
  const mainName = useMemo(() => without(concat(name, [data?.name]), undefined, null), [name, data?.name]);

  const getSizesOfElement = (elements?: itemElementProps[]): Array<any> =>
    map(elements, (element: itemElementProps) =>
      element?.elements ? getSizesOfElement(element?.elements) : toNumber(element?.size)
    );

  switch (data?.type) {
    case 'object':
      return (
        <Row gutter={[16, 8]} className="w-full m-0">
          {name?.length !== 1 && data?.title && <Divider orientation="right">{data?.title}</Divider>}
          {map(data?.elements, (element: any, index: number) => (
            <FormBuilder
              key={index}
              name={mainName}
              form={form}
              data={element}
              initialValues={initialValues}
              showLabel={showLabel}
              className={className}
            />
          ))}
          {name?.length !== 1 && <Divider />}
        </Row>
      );
    case 'array':
      return (
        <Row gutter={[16, 8]} className="w-full">
          {data?.title && (
            <Divider orientation="right" dashed>
              {data?.title}
            </Divider>
          )}
          <GroupInput
            name={mainName}
            initialValues={initialValues}
            form={form}
            onChange={(source: number, destination?: number) => {
              if (isFunction(form.getFieldsValue) && isFunction(form.setFieldsValue)) {
                const newValue = cloneWith(form.getFieldsValue(), (cloneValues) => {
                  update(cloneValues, compact(concat(name, [data?.name])), (list) =>
                    reorderList(list, source, destination)
                  );
                  return cloneValues;
                });
                form.setFieldsValue(newValue);
              }
            }}
            showLabel={toNumber(sum(flattenDeep(getSizesOfElement(data?.elements)))?.toFixed(2)) > 1}
            elements={data?.elements}
            title={data?.title}
          />
          <Divider dashed />
        </Row>
      );
    default:
      return (
        <FormItemBuilder
          form={form}
          name={mainName}
          index={index}
          listName={listName}
          elementDetail={data}
          initialValue={get(initialValues, mainName)}
          showLabel={showLabel}
          className={className}
        />
      );
  }
};

export default FormBuilder;
