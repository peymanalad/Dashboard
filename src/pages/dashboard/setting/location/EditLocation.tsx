import React from 'react';
import {Card, Row, Col, Form, Input, Button, InputNumber} from 'antd';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {SaveOutlined} from '@ant-design/icons';
import {MultiSelectPaginate} from 'components';
import {getLangSearchParam} from 'utils';

const EditLocation = () => {
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('setting');

  const [form] = Form.useForm();

  const fetchLocation = useFetch({
    name: ['location', id],
    url: 'locations/{id}',
    params: {id},
    enabled: !!id
  });

  const updateLocation = usePost({
    url: 'locations/{id}',
    method: 'PATCH',
    removeQueries: ['locations'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/location/list'));
    }
  });

  const storeLocation = usePost({
    url: 'locations',
    method: 'POST',
    removeQueries: ['locations', ['location', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/location/list'));
    }
  });

  const onFinish = (values: any) => {
    values.parent_id = values.parent_id?.id;
    id ? updateLocation.post(values, {}, {id}) : storeLocation.post(values);
  };

  return (
    <Card title={t('location')} bordered={false} loading={fetchLocation.isFetching} className="w-full">
      <Form form={form} layout="vertical" name="setting" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="full_name"
              label={t('full_name')}
              initialValue={fetchLocation?.data?.full_name}
              rules={[{required: true, message: t('messages.required')}]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('parent_location')}
              name="parent_id"
              rules={[
                {
                  validator: async (rule, value) => {
                    if (id && value == id) {
                      return Promise.reject(t('messages.sameParentLocation'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              initialValue={fetchLocation?.data?.parent}>
              <MultiSelectPaginate
                url="locations/paginate"
                keyValue="id"
                keyLabel="full_name"
                placeholder={t('empty')}
                urlName="FullLocations"
                isGeneral={false}
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="latitude"
              label={t('latitude')}
              initialValue={fetchLocation?.data?.latitude}
              rules={[{required: true, message: t('messages.required')}]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="longitude"
              label={t('longitude')}
              initialValue={fetchLocation?.data?.longitude}
              rules={[{required: true, message: t('messages.required')}]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateLocation.isLoading || storeLocation.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditLocation;
