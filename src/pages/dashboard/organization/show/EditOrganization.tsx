import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';

const EditOrganization: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchOrganization = useFetch({
    name: ['organization', id],
    url: 'services/app/Organizations/GetOrganizationForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeOrganization = usePost({
    url: '/services/app/Organizations/CreateOrEdit',
    method: 'POST',
    removeQueries: ['organizations'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/organization/list');
    }
  });

  const onFinish = (values: any) => {
    storeOrganization.post({...values, id: fetchOrganization?.data?.organization?.id});
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchOrganization?.data) || fetchOrganization.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="organization" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              name="organizationName"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.organizationName}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeOrganization.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditOrganization;
