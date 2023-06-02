import {Card, Space} from 'antd';
import {CollapseR} from 'components';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {convertMiladiToShamsiiiYear} from 'utils';

const ShowReport: FC = () => {
  const {t} = useTranslation('products');
  return (
    <Card title={t('product_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          type="bar"
          valueKey="price"
          labelKey="name"
          url="products/report/price_chart"
          urlName="price_chart"
          title={t('report.price_chart')}
          layout="horizontal"
          permission="products.count_chart"
          showLabel={false}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey="count"
          url="products/report/count_chart"
          urlName="count_chart"
          title={t('report.count_chart')}
          height="400px"
          permission="products.count_chart"
          labelConvertor={convertMiladiToShamsiiiYear}
        />
        <CollapseR
          type="pie"
          labelKey="name"
          valueKey="view"
          url="products/report/most_visited_chart"
          urlName="most_visited_chart"
          title={t('report.most_visited')}
          height="400px"
          showLegend
          showLabel={false}
          permission="products.most_visited_chart"
        />
        <CollapseR
          type="pie"
          labelKey="name"
          valueKey="count"
          url="products/report/most_visited_in_tehran"
          urlName="most_visited_in_tehran"
          title={t('report.most_visited_in_tehran')}
          height="400px"
          showLegend
          permission="products.most_visited_in_tehran"
        />
      </Space>
    </Card>
  );
};

export default ShowReport;
