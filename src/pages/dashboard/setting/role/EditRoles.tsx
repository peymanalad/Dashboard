import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {FormActions, TreeSelect} from 'components';
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

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace('/setting/role/list');
  };

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
    url: 'services/app/Role/CreateOrUpdateRole',
    method: 'POST',
    removeQueries: ['roles'],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    values.role.id = fetchRole?.data?.role?.id;
    storeRole.post(values);
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
              name={['role', 'displayName']}
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
              name={['role', 'isDefault']}
              valuePropName="checked"
              className="m-0"
              initialValue={fetchRole?.data?.role?.isDefault}
              help={t('assign_to_new_user_by_default')}>
              <Checkbox>{t('default')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="grantedPermissionNames"
              label={t('permissions')}
              initialValue={fetchRole?.data?.grantedPermissionNames}>
              <TreeSelect treeData={convertPermissionsToTreeNode(fetchPermissions?.data?.items)} />
            </Form.Item>
          </Col>
        </Row>
        <FormActions isLoading={storeRole.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditRole;
