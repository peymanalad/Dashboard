import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {TreeSelect} from 'components';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {convertPermissionsToTreeNode} from 'utils/tree';

const EditRole: FC = () => {
  const {t} = useTranslation('permission');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchRole = useFetch({
    name: ['role', id],
    url: '/services/app/Role/GetRoleForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const fetchPermissions = useFetch({
    name: 'permissions',
    url: '/services/app/Permission/GetAllPermissions',
    enabled: true
  });

  const storeRole = usePost({
    url: 'services/app/Roles/CreateOrEdit',
    method: 'POST',
    removeQueries: ['roles'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/group/list');
    }
  });

  const onFinish = (values: any) => {
    storeRole.post({groupName: values?.groupName, organizationId: values?.organization?.organization?.id});
  };

  return (
    <Card
      title={t('role')}
      bordered={false}
      loading={(id && !fetchRole?.data) || fetchRole.isFetching || fetchPermissions?.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="organization" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="displayName"
              label={t('name')}
              rules={[
                {required: true, message: t('messages.required')},
                {min: 5, message: t('messages.required')}
              ]}
              initialValue={fetchRole?.data?.role?.displayName}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="isDefault"
              valuePropName="checked"
              className="m-0"
              initialValue={false}
              help={t('assign_to_new_user_by_default')}>
              <Checkbox>{t('default')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="permissions"
              label={t('permissions')}
              initialValue={fetchRole?.data?.grantedPermissionNames}>
              <TreeSelect treeData={convertPermissionsToTreeNode(fetchPermissions?.data?.items)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeRole.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditRole;
