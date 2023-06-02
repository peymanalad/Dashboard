import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {JsonEditor, SimpleSelect} from 'components';
import {requiredVersionType, OSType, AppType} from 'assets';
import {getLangSearchParam} from 'utils';
import map from 'lodash/map';

const EditApplication: FC = () => {
  const {t} = useTranslation('setting');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchVersion = useFetch({
    name: ['version', id],
    url: 'versions/{id}',
    params: {id},
    enabled: !!id
  });

  const storeVersion = usePost({
    url: '/versions',
    method: 'POST',
    removeQueries: ['versions'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/application/list'));
    }
  });

  const updateVersion = usePost({
    url: 'versions/{id}',
    method: 'PATCH',
    removeQueries: ['versions', ['version', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/application/list'));
    }
  });

  const onFinish = (values: any) => {
    id ? updateVersion.post(values, {}, {id}) : storeVersion.post(values);
  };

  return (
    <Card
      title={t('application')}
      bordered={false}
      loading={fetchVersion.isFetching && fetchVersion.isLoading && !fetchVersion.data}
      className="w-full">
      <Form form={form} layout="vertical" name="version" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="version"
              label={t('version')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.version}>
              <Input className="w-full ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="type"
              label={t('type')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.type}>
              <SimpleSelect keys="name" label="name" data={AppType} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="required"
              label={t('required')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.required}>
              <SimpleSelect
                keys="id"
                label="name_fa"
                data={map(requiredVersionType, (value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="os"
              label={t('os')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.os}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={map(OSType, (value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="change_log"
              label={t('changes')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.change_log}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Form.Item
            name="meta"
            label={t('meta')}
            className="w-full"
            rules={[{required: true, message: t('messages.required')}]}
            initialValue={fetchVersion?.data?.meta}>
            <JsonEditor disableClipboard />
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateVersion.isLoading || storeVersion.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditApplication;
