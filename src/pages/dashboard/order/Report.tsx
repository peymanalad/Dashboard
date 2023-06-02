import {Card, Col, Row, Space, Form, Input} from 'antd';
import {CollapseR, DateTimePicker} from 'components';
import React, {FC, ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import {convertMiladiToShamsiiiYear} from 'utils';

const OrderReport: FC = () => {
  const {t} = useTranslation('order');

  const formBody: ReactElement = (
    <Row gutter={8} className="w-full">
      <Col span={8}>
        <Form.Item label={t('form.start_at')} name="start_at" rules={[{required: true, message: t('required')}]}>
          <DateTimePicker isGregorian={false} timePicker />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label={t('form.end_at')} name="end_at" rules={[{required: true, message: t('required')}]}>
          <DateTimePicker isGregorian={false} timePicker />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label={t('form.count')} name="count" rules={[{required: true, message: t('required')}]}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Card title={t('orders_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          url="orders/report/payment_chart"
          urlName="payment_chart"
          title={t('payment_chart')}
          type="bar"
          showLabel={true}
          permission="orders.payment_chart"
          labelConvertor={convertMiladiToShamsiiiYear}
          height="500px"
          chartKey={t('count')}
        />
        <CollapseR
          type="pie"
          labelKey="name"
          valueKey="count"
          url="orders/report/most_service_purchased"
          urlName="most_service_purchased"
          title={t('most_service_purchased')}
          height="300px"
          showLabel
          permission="orders.most_service_purchased"
        />
        <CollapseR
          type="bar"
          labelKey="name"
          valueKey="sum"
          url="orders/report/most_payment_per_doctor"
          urlName="most_payment_per_doctor"
          title={t('most_payment_per_doctor')}
          layout="horizontal"
          showLabel={false}
          permission="orders.most_payment_per_doctor"
        />
        <CollapseR
          type="number"
          labelKey="name"
          valueKey="sum"
          url="orders/report/revenue_per_employee"
          urlName="revenue_per_employee"
          title={t('revenue_per_employee')}
          formBody={formBody}
          permission="orders.revenue_per_employee"
        />
        <CollapseR
          type="line"
          url="orders/report/income_chart"
          urlName="income_chart"
          title={t('income_chart')}
          height="400px"
          labelConvertor={convertMiladiToShamsiiiYear}
          permission="orders.income_chart"
          chartKey={t('income')}
        />
      </Space>
    </Card>
  );
};

export default OrderReport;
