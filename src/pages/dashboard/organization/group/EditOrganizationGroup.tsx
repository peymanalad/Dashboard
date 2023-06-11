import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {MultiSelectPaginate} from 'components';

const EditOrganizationGroup: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchOrganizationGroup = useFetch({
    name: ['organizationGroup', id],
    url: 'services/app/Organizations/GetOrganizationGroupsForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeOrganizationGroup = usePost({
    url: '/services/app/OrganizationGroups/CreateOrEdit',
    method: 'POST',
    removeQueries: ['organizationGroups'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/group/list');
    }
  });

  const onFinish = (values: any) => {
    storeOrganizationGroup.post({groupName: values?.groupName, organizationId: values?.organization?.organization?.id});
  };

  return (
    <Card
      title={t('organization_groups')}
      bordered={false}
      loading={(id && !fetchOrganizationGroup?.data) || fetchOrganizationGroup.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="organization" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="groupName"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganizationGroup?.data?.organizationGroup?.groupName}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t('organization')} name="organization">
              <MultiSelectPaginate
                mode="single"
                urlName="organizations"
                url="services/app/Organizations/GetAll"
                keyPath={['organization']}
                keyImage="avatar"
                keyValue="id"
                keyLabel="organizationName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeOrganizationGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditOrganizationGroup;
