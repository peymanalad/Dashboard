import React from 'react';
import {Card, Row, Col, Form, Input, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {getLangSearchParam} from 'utils';

const EditPermissions = () => {
  const history = useHistory();
  const {id} = useParams<{id?: any}>();
  const {t} = useTranslation('permission');

  const [form] = Form.useForm();

  const fetchPermission = useFetch({
    name: ['permission', id],
    url: 'permissions/{id}',
    params: {id},
    enabled: true
  });

  const updatePermission = usePost({
    url: 'permissions/{id}',
    method: 'PATCH',
    removeQueries: ['permissions', ['permission', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/permission/list'));
    }
  });

  const createPermission = usePost({
    url: 'permissions',
    method: 'POST',
    removeQueries: ['permissions'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/permission/list'));
    }
  });

  const Submit = (values: any) => {
    id ? updatePermission.post(values, {}, {id}) : createPermission.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('permission')}
      loading={(fetchPermission.isFetching && fetchPermission.isLoading) || (id && !fetchPermission.data)}
      bordered={false}>
      <Form form={form} name="permission" requiredMark={false} layout="vertical" onFinish={Submit}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="name"
              label={t('name')}
              initialValue={fetchPermission?.data?.name || ''}
              rules={[{required: true, message: t('messages.required')}]}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createPermission.isLoading || updatePermission.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditPermissions;
