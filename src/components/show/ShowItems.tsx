import React, {ReactNode} from 'react';
import {Col, Row, Typography, Table, Divider, Avatar} from 'antd';
import entries from 'lodash/entries';
import map from 'lodash/map';
import join from 'lodash/join';
import split from 'lodash/split';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import includes from 'lodash/includes';
import {tableProps} from 'types/common';
import moment from 'moment-jalaali';
import {convertUtcTimeToLocal} from 'utils';

export interface Props {
  data: any;
  firstKeysShow?: string[];
  tables?: tableProps[];
  t: (key: string | string[], options?: object) => string;
}

const ShowItems = ({data, firstKeysShow, tables, t}: Props) => {
  const {Text, Title} = Typography;

  const getWidthSpanArray = (length: number) => {
    if (length < 5) return 6;
    if (length < 10) return 12;
    return 24;
  };

  const showValue = (value: any): string | number => {
    if (moment(value).isValid() && !isNumber(value) && !isObject(value))
      return convertUtcTimeToLocal(value, 'jYYYY/jMM/jDD');
    if (isNumber(value)) return value;
    return t(`${value?.name || value?.title || value || '-'}`);
  };

  const ConvertValue = (key: string, value: any): ReactNode => {
    if (key === 'avatar')
      return (
        <Col xs={24} sm={12} md={8} order={1}>
          <div className="flex flex-col justify-center align-center">
            <Avatar size={80} src={data?.avatar} />
          </div>
        </Col>
      );

    if (isBoolean(value))
      return (
        <Col xs={24} sm={12} md={8} key={key} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t(split(key, '.'))}</Title>
            <Text keyboard className="mb-2">
              {t(`${value}`)}
            </Text>
          </div>
        </Col>
      );

    if ((value === 0 || value === 1) && key.startsWith('is_'))
      return (
        <Col xs={24} sm={12} md={8} key={key} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t(key)}</Title>
            <Text keyboard className="mb-2">
              {value === '0' ? t('false') : t('true')}
            </Text>
          </div>
        </Col>
      );
    if (isArray(value))
      return (
        <Col xs={24} sm={12} md={getWidthSpanArray(value?.length)} key={key} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t(key)}</Title>
            <Text keyboard className="mb-2">
              {join(
                map(value, (val: any) => showValue(val)),
                ' ، '
              ) || t('empty')}
            </Text>
          </div>
        </Col>
      );
    if (!isUndefined(value) || includes(firstKeysShow, key))
      return (
        <Col xs={24} sm={12} md={8} key={key} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t(key)}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {showValue(value)}
            </Text>
          </div>
        </Col>
      );
  };

  const ConvertObject = (deep: number, data: any): ReactNode[] => {
    let ListElements: ReactNode[] = [];

    if (firstKeysShow && deep === 1)
      ListElements = map(firstKeysShow, (firstKey: string) => ConvertValue(firstKey, data[firstKey]));

    entries(data).forEach(([key, value]) => {
      if ((!includes(firstKeysShow, key) && !includes(map(tables, 'name'), key)) || deep !== 1) {
        if (isObject(value) && !isArray(value)) {
          ListElements.push(
            <Col span={24} className={`mx-${deep * 5}`} order={2}>
              <Row gutter={[16, 8]} className="w-full">
                <Col span={24}>
                  <Divider orientation="right">{t(key)}</Divider>
                </Col>
                {ConvertObject(deep + 1, value)}
                <Divider dashed />
              </Row>
            </Col>
          );
          ListElements.push(<Col span={24} />);
        } else ListElements.push(ConvertValue(key, value));
      }
    });

    if (tables && deep === 1)
      forEach(tables, (table: tableProps, index: number) => {
        ListElements.push(
          <Col span={24} key={index} className="mt-2 align-center justify-center" order={2}>
            <Table columns={table.columns} dataSource={table.data} />
          </Col>
        );
      });

    return ListElements;
  };

  return (
    <Row gutter={[16, 8]} className="w-full">
      {data && ConvertObject(1, data)}
    </Row>
  );
};

export default ShowItems;
