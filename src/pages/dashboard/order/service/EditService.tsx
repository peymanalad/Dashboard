import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, InputNumber} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, SimpleSelect} from 'components';
import {is_confirmService, typeService} from 'assets';
import {getLangSearchParam} from 'utils';

const EditService: FC = () => {
  const {t} = useTranslation('service');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const [form] = Form.useForm();

  const fetchService = useFetch({
    name: ['service', id],
    url: 'services/{id}',
    params: {id},
    enabled: !!id
  });

  const storeService = usePost({
    url: '/services',
    method: 'POST',
    removeQueries: ['services'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/service/list'));
    }
  });

  const updateService = usePost({
    url: 'services/{id}',
    method: 'PATCH',
    removeQueries: ['services', ['service', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/order/service/list'));
    }
  });

  const onFinish = (values: any) => {
    try {
      values.meta = JSON.parse(values?.meta);
    } catch (e) {
      values.meta = '';
    }
    values.picture = values?.picture?.path;
    id ? updateService.post(values, {}, {id}) : storeService.post(values);
  };

  return (
    <Card
      title={t('services')}
      bordered={false}
      loading={(id && !fetchService?.data) || fetchService.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="service" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.name || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
            <Form.Item
              name="is_active"
              label={t('status')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.is_active}>
              <SimpleSelect
                keys="id"
                label="name_fa"
                data={map(is_confirmService, (value) => ({
                  ...value,
                  name_fa: t(value?.name)
                }))}
              />
            </Form.Item>
          </Col>
          <Col
            xs={{span: 24, order: 1}}
            md={{span: 12, order: 1}}
            lg={{span: 8, order: 3}}
            className="flex upload-center">
            <Form.Item
              name="picture"
              noStyle
              initialValue={
                fetchService?.data?.picture_url && {
                  path: fetchService?.data?.picture,
                  url: fetchService?.data?.picture_url
                }
              }>
              <CustomUpload type="products" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="price"
              label={t('price')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.price}>
              <InputNumber className="w-full" minLength={0} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="type"
              label={t('type')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.type}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={map(typeService, (value) => ({
                  ...value,
                  name_fa: t(value?.name)
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="percent"
              label={t('doctorProviderPercent')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.percent || ''}>
              <InputNumber className="w-full" minLength={0} maxLength={3} min={0} max={100} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="count"
              label={t('count')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchService?.data?.count}>
              <InputNumber className="w-full" minLength={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="meta"
              label={t('meta')}
              className="w-full"
              initialValue={JSON.stringify(fetchService?.data?.meta)}>
              <Input.TextArea dir="ltr" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('description')}
              className="w-full"
              initialValue={fetchService?.data?.description}>
              <Input.TextArea className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeService.isLoading || updateService.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditService;
