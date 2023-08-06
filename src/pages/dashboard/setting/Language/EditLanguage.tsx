import React from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import {usePost, useFetch} from 'hooks';
import {SimpleSelect} from 'components';
import {directions} from 'assets';
import {getLangSearchParam} from 'utils';

const EditLanguage = () => {
  const {t} = useTranslation('setting');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchLanguage = useFetch({
    name: ['language', id],
    url: 'languages/{id}',
    params: {id},
    enabled: !!id
  });

  const storeLanguage = usePost({
    url: '/languages',
    method: 'POST',
    removeQueries: ['languages'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/language/list'));
    }
  });

  const updateLanguage = usePost({
    url: 'languages/{id}',
    method: 'PATCH',
    removeQueries: ['languages', ['language', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/language/list'));
    }
  });

  const onFinish = (values: any) => {
    id ? updateLanguage.post(values, {}, {id}) : storeLanguage.post(values);
  };

  return (
    <Card title={t('title')} bordered={false} className="w-full" loading={fetchLanguage?.isFetching}>
      <Form form={form} layout="vertical" name="language" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchLanguage?.data?.name}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="direction"
              label={t('direction')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchLanguage?.data?.direction}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={map(directions, (value) => ({...value, name_fa: t(value?.name)}))}
                defaultValues={fetchLanguage?.data?.direction}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeLanguage.isLoading || updateLanguage.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditLanguage;
