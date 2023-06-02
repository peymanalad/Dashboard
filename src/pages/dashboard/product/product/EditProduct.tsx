import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, InputNumber, Checkbox} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, DrillDownSelectPaginate, MultiSelectPaginate} from 'components';
import {getLangSearchParam} from 'utils';
import map from 'lodash/map';

const EditProduct: FC = () => {
  const {t} = useTranslation('products');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchProduct = useFetch({
    name: ['product', id],
    url: 'products/{id}',
    params: {id},
    enabled: !!id
  });

  const storeProduct = usePost({
    url: '/products',
    method: 'POST',
    removeQueries: ['products'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/product/product/list'));
    }
  });

  const updateProduct = usePost({
    url: 'products/{id}',
    method: 'PATCH',
    removeQueries: ['products', ['product', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/product/product/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path || null;
    values.type_id = values.type_id?.id;
    values.provider_id = values.provider_id?.id;
    values.diseases_id = map(values.diseases_id, 'id');
    values.locations_id = map(values.locations_id, 'id');
    id ? updateProduct.post(values, {}, {id}) : storeProduct.post(values);
  };

  return (
    <Card
      title={id ? t('edit_product') : t('create_product')}
      loading={(id && !fetchProduct?.data) || fetchProduct.isFetching}
      bordered={false}
      className="w-full">
      <Form form={form} layout="vertical" name="product" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.name || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
            <Form.Item
              label={t('provider')}
              name="provider_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.provider}>
              <MultiSelectPaginate
                url="users/providers"
                keyValue="id"
                keyLabel="name"
                placeholder={t('empty')}
                urlName="providers"
                isGeneral
                showSearch
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
                fetchProduct?.data?.picture_url && {
                  path: fetchProduct?.data?.picture,
                  url: fetchProduct?.data?.picture_url
                }
              }>
              <CustomUpload type="products" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="price"
              label={t('price')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.price || ''}>
              <InputNumber className="w-full" minLength={0} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="discount_percent"
              label={t('discount_percent')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.discount_percent}>
              <InputNumber className="w-full" minLength={0} maxLength={3} min={0} max={100} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
            <Form.Item
              name="is_active"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchProduct?.data?.is_active}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('type')} name="type_id" initialValue={fetchProduct?.data?.type}>
              <MultiSelectPaginate
                url="product_types/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="product_types"
                isGeneral={false}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['meta', 'brand_name']}
              label={t('brand_name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchProduct?.data?.meta?.brand_name}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['meta', 'access_link']}
              label={t('access_link')}
              rules={[{type: 'url', message: t('messages.url')}]}
              initialValue={fetchProduct?.data?.link}>
              <Input type="url" className="ltr-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name={['meta', 'phone']} label={t('phone')} initialValue={fetchProduct?.data?.meta?.phone || ''}>
              <Input type="number" inputMode="tel" minLength={11} maxLength={11} className="ltr-input" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name={['meta', 'address']}
              label={t('address')}
              initialValue={fetchProduct?.data?.meta?.address || ''}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item name="locations_id" label={t('locations')} initialValue={fetchProduct?.data?.locations}>
              <MultiSelectPaginate
                mode="multiple"
                placeholder={t('all')}
                url="locations/full"
                urlName="fullLocations"
                keyValue="id"
                keyLabel="name"
                isGeneral
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item name="diseases_id" label={t('diseases')} initialValue={fetchProduct?.data?.diseases}>
              <DrillDownSelectPaginate
                title={t('diseases')}
                placeholder={t('all')}
                mode="multiple"
                url="diseases/children"
                urlName="Diseases"
                isGeneral
                keyLabel="name"
                keyValue="id"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('description')}
              className="w-full"
              initialValue={fetchProduct?.data?.description || ''}>
              <Input.TextArea className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeProduct.isLoading || updateProduct.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditProduct;
