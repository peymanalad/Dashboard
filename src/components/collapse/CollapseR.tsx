import {Button, Collapse, Form, Row, Spin, Typography} from 'antd';
import {Pie, HorizontalBar, VerticalBar, Line} from 'components';
import {useFetch, useUser} from 'hooks';
import React, {FC, ReactElement} from 'react';
import toNumber from 'lodash/toNumber';
import {useTranslation} from 'react-i18next';
import replace from 'lodash/replace';
import {LineChartOutlined} from '@ant-design/icons';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import {PropertyPath} from 'lodash';
import isEmpty from 'lodash/isEmpty';

interface IProps {
  title: string;
  type?: 'bar' | 'pie' | 'line' | 'number' | 'link';
  url: string;
  urlName?: Array<string | number | undefined | null> | string;
  labelKey?: string;
  valueKey?: string | string[] | any;
  path?: PropertyPath;
  numberText?: string;
  height?: string;
  chartMaxWidth?: string;
  formBody?: ReactElement;
  showLabel?: boolean;
  layout?: 'horizontal' | 'vertical';
  query?: object;
  permission?: string;
  dateFormat?: string;
  valueConvertor?(data: any): string;
  labelConvertor?(data: any): string;
  labelAddOn?: string;
  chartKey?: string;
  showLegend?: boolean;
}
const CollapseR: FC<IProps> = ({
  type,
  title,
  url,
  numberText,
  height,
  path,
  valueKey,
  labelKey,
  formBody,
  urlName,
  showLabel,
  showLegend,
  layout,
  query,
  permission,
  valueConvertor,
  labelConvertor,
  labelAddOn,
  chartKey
}) => {
  const {t} = useTranslation('general');
  const user = useUser();
  const {Title, Text} = Typography;

  const fetchData = useFetch({
    name: urlName,
    url,
    query,
    enabled: false,
    isGeneral: false
  });

  const collapseChangeHandler = () => {
    if (!fetchData?.isFetched && !formBody && type) {
      fetchData.refetch();
    }
  };
  const onFinish = (values: any) => {
    fetchData.fetch({}, values);
  };

  const calcHeight = (height: any) => {
    if (height) {
      return height;
    }
    if (isArray(fetchData.data)) {
      return `${fetchData.data.length * 30}px`;
    }
    return `${keys(fetchData.data).length * 30}px`;
  };

  const selectType = (): ReactElement => {
    switch (type) {
      case 'bar':
        return layout === 'horizontal' ? (
          <HorizontalBar
            height={calcHeight(height)}
            valueKey={valueKey!}
            labelKey={labelKey!}
            data={isUndefined(path) ? fetchData?.data : get(fetchData?.data, path)}
            showLabel={showLabel}
            valueConvertor={valueConvertor}
            labelConvertor={labelConvertor}
            chartKey={chartKey}
            showLegend={showLegend}
          />
        ) : (
          <VerticalBar
            height={calcHeight(height)}
            valueKey={valueKey!}
            labelKey={labelKey!}
            data={isUndefined(path) ? fetchData?.data : get(fetchData?.data, path)}
            showLabel={showLabel}
            valueConvertor={valueConvertor}
            labelConvertor={labelConvertor}
            chartKey={chartKey}
            showLegend={showLegend}
          />
        );
      case 'pie':
        return (
          <Pie
            height={height}
            //@ts-ignore
            valueKey={valueKey!}
            labelKey={labelKey!}
            data={isUndefined(path) ? fetchData?.data : get(fetchData?.data, path)}
            showLabel={showLabel}
            // valueConvertor={valueConvertor}
            // labelConvertor={labelConvertor}
            suffix={labelAddOn}
            chartKey={chartKey}
            showLegend={showLegend}
          />
        );
      case 'line':
        return (
          <Line
            height={height || ''}
            //@ts-ignore
            valueKey={valueKey!}
            labelKey={labelKey!}
            data={isUndefined(path) ? fetchData?.data : get(fetchData?.data, path)}
            showLabel={showLabel}
            valueConvertor={valueConvertor}
            labelConvertor={labelConvertor}
            chartKey={chartKey}
          />
        );
      case 'number': {
        const fixedNumber = toNumber(isUndefined(path) ? fetchData?.data : get(fetchData?.data, path))?.toFixed(2);
        return <Text>{numberText ? replace(numberText, '{value}', fixedNumber) : fixedNumber}</Text>;
      }
      case 'link':
        return fetchData.isFetched ? (
          <Row className="w-full">
            <Button
              href={isUndefined(path) ? fetchData?.data : get(fetchData?.data, path)}
              type="primary"
              className="w-full  md:mx-auto">
              {t('downloadFile')}
            </Button>
          </Row>
        ) : (
          <div />
        );
      default:
        return (
          <Title level={5} className="text-center">
            {t('comingSoon')}
          </Title>
        );
    }
  };
  if (user.hasPermission(permission!) || !permission)
    return (
      <Collapse accordion onChange={collapseChangeHandler} className="shadow-md">
        <Collapse.Panel
          header={
            <Title level={5} className="m-0">
              {title}
            </Title>
          }
          key="1">
          <Form layout="vertical" name="CollapseR" requiredMark={false} onFinish={onFinish}>
            {formBody}
            {formBody && (
              <Row gutter={[16, 8]} className="w-full flex justify-end align-center">
                <Button
                  className="my-5 self-end"
                  type="primary"
                  htmlType="submit"
                  loading={fetchData.isFetching}
                  icon={<LineChartOutlined />}>
                  {t('showReport')}
                </Button>
              </Row>
            )}
            {!fetchData.isFetching ? selectType() : <Spin className="flex-center my-2" />}
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  return null;
};

export default CollapseR;
