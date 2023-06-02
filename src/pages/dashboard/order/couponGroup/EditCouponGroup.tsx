import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {getLangSearchParam} from 'utils';

const EditCouponGroup: FC = () => {
  const {t} = useTranslation('service');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchCouponGroup = useFetch({
    name: ['couponGroup', id],
    url: 'coupon_groups/{id}',
    params: {id},
    enabled: !!id
  });

  const storeCouponGroup = usePost({
    url: '/coupon_groups',
    method: 'POST',
    removeQueries: ['couponGroups'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/coupon_group/list'));
    }
  });

  const updateCouponGroup = usePost({
    url: 'coupon_groups/{id}',
    method: 'PATCH',
    removeQueries: ['couponGroups', ['couponGroup', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/coupon_group/list'));
    }
  });

  const onFinish = (values: any) => {
    id ? updateCouponGroup.post(values) : storeCouponGroup.post(values);
  };

  return (
    <Card title={t('coupon_group')} bordered={false} loading={fetchCouponGroup?.isFetching} className="w-full">
      <Form form={form} layout="vertical" name="coupon_group" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCouponGroup?.data?.name || ''}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeCouponGroup.isLoading || updateCouponGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditCouponGroup;
