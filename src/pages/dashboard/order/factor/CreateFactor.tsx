import React, {FC, useRef} from 'react';
import {Card, Form, Row, Col, Input, Typography, Button, Space} from 'antd';
import {DollarOutlined, SaveOutlined} from '@ant-design/icons';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost} from 'hooks';
import {MultiSelectPaginate} from 'components';
import {useCountUp} from 'react-countup';
import map from 'lodash/map';
import {getLangSearchParam, queryStringToObject} from 'utils';

const {Text} = Typography;

const CreateFactor: FC = () => {
  const {t} = useTranslation('factor');
  const history = useHistory();
  const [form] = Form.useForm();
  const queryObject = queryStringToObject(useLocation().search);
  const isCalculate = useRef<boolean>(false);

  const {update} = useCountUp({
    ref: 'counter',
    start: 0,
    end: 0,
    separator: ',',
    duration: 2,
    onEnd: ({start}) => {
      if (calculatePrice.isLoading) start();
    }
  });

  const storeOrder = usePost({
    url: '/orders',
    method: 'POST',
    removeQueries: ['orders'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/factor/list'));
    }
  });

  const calculatePrice = usePost({
    url: '/orders/calculate_price',
    method: 'GET',
    onSuccess: (data) => {
      update(data);
    },
    onError() {
      update(0);
    }
  });

  const onFinish = (values: any) => {
    values.user_id = values?.user_id?.id;
    values.services_id = map(values?.services_id, 'id');
    if (isCalculate?.current) {
      update(50000);
      calculatePrice.post({}, values, []);
    } else storeOrder.post(values);
  };

  return (
    <Card title={t('factor')} bordered={false} className="w-full">
      <Form layout="vertical" name="createFactor" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={8}>
            <Form.Item name="user_id" label={t('user_name')} initialValue={queryObject?.user}>
              <MultiSelectPaginate
                url="users/patients"
                urlName="users_patients"
                keyValue="id"
                keyLabel="full_name"
                showValue
                placeholder={t('empty')}
                isGeneral
                allowClear
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item
              name="services_id"
              label={t('services')}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelectPaginate
                mode="multiple"
                url="services/paginate"
                keyValue="id"
                keyLabel="name"
                placeholder={t('empty')}
                urlName="services"
                isGeneral
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="discount_code" label={t('discount_code')}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={16} className="flex justify-end align-center">
            <div className="flex justify-around align-center w-half">
              <h4>{`${t('total_price')} : `}</h4>
              <Space size="small">
                <Text type="secondary" id="counter" />
                <Text type="secondary">{t('rial')}</Text>
              </Space>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="my-5">
          <Col span={24} className="flex flex-col sm:flex-row items-center justify-between">
            <Button
              type="primary"
              htmlType="submit"
              className="ml-auto w-full sm:w-unset"
              icon={<DollarOutlined />}
              loading={calculatePrice.isLoading}
              onClick={() => {
                isCalculate.current = true;
              }}
              danger>
              {t('calculate_price')}
            </Button>
            <Button
              className="w-full sm:w-unset mr-auto my-4"
              type="primary"
              htmlType="submit"
              loading={storeOrder.isLoading}
              onClick={() => {
                isCalculate.current = false;
              }}
              icon={<SaveOutlined />}>
              {t('save')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateFactor;
