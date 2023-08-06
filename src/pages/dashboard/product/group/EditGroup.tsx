import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload} from 'components';
import {getLangSearchParam} from 'utils';

const EditProduct: FC = () => {
  const {t} = useTranslation('products');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchProduct = useFetch({
    name: ['productType', id],
    url: 'product_types/{id}',
    params: {id},
    enabled: !!id
  });

  const storeProduct = usePost({
    url: '/product_types',
    method: 'POST',
    removeQueries: ['productTypes'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/product/group/list'));
    }
  });

  const updateProduct = usePost({
    url: 'product_types/{id}',
    method: 'PATCH',
    removeQueries: ['productTypes', ['productType', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/product/group/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path;
    id ? updateProduct.post(values) : storeProduct.post(values);
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchProduct?.data) || fetchProduct.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="product" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full flex justify-between align-center">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.name || ''}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.title || ''}>
              <Input />
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
                fetchProduct?.data?.picture_url && {
                  path: fetchProduct?.data?.picture,
                  url: fetchProduct?.data?.picture_url
                }
              }>
              <CustomUpload type="products" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full flex justify-between align-center">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="is_active"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchProduct?.data?.is_active}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateProduct.isLoading || storeProduct.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditProduct;
