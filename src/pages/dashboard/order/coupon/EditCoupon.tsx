import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, InputNumber, Checkbox} from 'antd';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import map from 'lodash/map';
import {usePost, useFetch} from 'hooks';
import {DateTimePicker, MultiSelectPaginate} from 'components';
import {getLangSearchParam} from 'utils';

const EditCoupon: FC = () => {
  const {t} = useTranslation('service');
  const history = useHistory();
  const {id} = useParams<any>();

  const [form] = Form.useForm();

  const fetchCoupon = useFetch({
    name: ['coupon', id],
    url: 'coupons/{id}',
    params: {id},
    enabled: !!id
  });

  const storeCoupon = usePost({
    url: '/coupons',
    method: 'POST',
    removeQueries: ['coupons'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/coupon/list'));
    }
  });

  const updateCoupon = usePost({
    url: 'coupons/{id}',
    method: 'PATCH',
    removeQueries: ['coupons', ['coupon', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/coupon/list'));
    }
  });

  const onFinish = (values: any) => {
    const formData: object = {};
    forEach(values.services, (item: any) => {
      set(formData, item.service.id, {discount_percent: item.discount_percent});
    });
    values.services = formData;
    id ? updateCoupon.post(values, {}, {id}) : storeCoupon.post(values);
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={fetchCoupon.isFetching || fetchCoupon.isLoading || (id && !fetchCoupon.data)}
      className="w-full">
      <Form form={form} layout="vertical" name="coupon" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCoupon?.data?.title}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('coupon_group')} name="group_id" initialValue={fetchCoupon?.data?.group}>
              <MultiSelectPaginate
                url="coupon_groups/paginate"
                keyValue="id"
                keyLabel="name"
                placeholder={t('empty')}
                urlName="coupon_groups"
                isGeneral={false}
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="expired_at"
              initialValue={fetchCoupon?.data?.expired_at}
              rules={[{required: true, message: t('messages.date_time')}]}
              label={t('expired_at')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="amount"
              label={t('amount')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCoupon?.data?.amount}>
              <InputNumber className="w-full" minLength={0} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="amount_used"
              label={t('amount_used')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCoupon?.data?.amount_used || 0}>
              <InputNumber disabled className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="code"
              label={t('code')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCoupon?.data?.code || ''}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6} className="flex-center">
            <Form.Item
              name="is_active"
              valuePropName="checked"
              className="m-0"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchCoupon?.data?.is_active}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row className="w-full overflow-x-auto md:overflow-visible">
          <Row className="w-full min-w-600px">
            <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
              <Col span={11} className="text-right pl-3">
                {t('services')}
              </Col>
              <Col span={11} className="text-right pl-3">
                {t('discount')}
              </Col>
            </Row>
            <Form.List name="services" initialValue={fetchCoupon?.data?.services}>
              {(fields, {add, remove}) => {
                return (
                  <>
                    <Row className="w-full p-3 border-1 border-gainsBoro border-solid">
                      <Col className="w-full">
                        <Button type="dashed" onClick={() => add({}, 0)} block icon={<PlusOutlined />}>
                          {t('add_service')}
                        </Button>
                      </Col>
                    </Row>
                    {map(fields, (field) => (
                      <Row
                        key={field.key}
                        className="w-full p-3 border-1 border-gainsBoro border-solid"
                        style={{borderTopWidth: 0}}>
                        <Form.Item noStyle {...field}>
                          <Col span={11} className="pl-10">
                            <Form.Item
                              name={[field.name, 'service']}
                              className="no-validate-message"
                              fieldKey={[field.key, 'service']}>
                              <MultiSelectPaginate
                                url="services/paginate"
                                keyValue="id"
                                keyLabel="name"
                                placeholder={t('empty')}
                                urlName="services"
                                isGeneral={false}
                                showSearch
                                className="w-full h-full"
                                dropDownWith
                              />
                            </Form.Item>
                          </Col>
                          <Col span={11} className="pl-10">
                            <Form.Item
                              name={[field.name, 'discount_percent']}
                              className="no-validate-message"
                              fieldKey={[field.key, 'discount_percent']}>
                              <Input type="number" placeholder={t('discount_percent')} />
                            </Form.Item>
                          </Col>
                        </Form.Item>
                        <Col span={2} className="flex justify-center">
                          <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                        </Col>
                      </Row>
                    ))}
                  </>
                );
              }}
            </Form.List>
          </Row>
        </Row>
        <Row className="w-full">
          <Form.Item
            name="description"
            label={t('description')}
            className="w-full my-4"
            initialValue={fetchCoupon?.data?.description}>
            <Input.TextArea className="w-full" />
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateCoupon.isLoading || storeCoupon.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditCoupon;
