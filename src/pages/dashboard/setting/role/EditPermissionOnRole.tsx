import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Row, Col, Button, Form} from 'antd';
import {MultiSelectPaginate} from 'components';
import map from 'lodash/map';
import {PlusOutlined, DeleteOutlined, SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {permissionRoleProps} from 'types/permission';
import isUndefined from 'lodash/isUndefined';
import {getLangSearchParam} from 'utils';

const EditPermissionOnRole: FC = () => {
  const {t} = useTranslation('permission');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const [form] = Form.useForm();

  const fetchPermissions = useFetch({
    name: 'PermissionsOnRole',
    url: 'roles/{id}/assign',
    params: {id},
    enabled: true
  });

  const updatePermission = usePost({
    url: 'roles/{id}/assign',
    method: 'POST',
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/permission/role/list'));
    }
  });

  const onFinish = (values: any) => {
    values.permissions = map(values?.permissions, (val: permissionRoleProps) => ({
      permission_id: val?.permission?.id,
      on_role_id: val?.on_role?.id
    }));
    updatePermission.post(values, {}, {id});
  };

  return (
    <Card
      title={t('change-role')}
      bordered={false}
      className="w-full"
      loading={!isUndefined(id) && fetchPermissions.isFetching}
      extra={
        <Button
          type="primary"
          loading={updatePermission.isLoading}
          className="d-text-none md:d-text-unset"
          onClick={() => {
            form.submit();
          }}
          icon={<SaveOutlined />}>
          {t('save')}
        </Button>
      }>
      <Form form={form} className="flex-center w-full flex-col" onFinish={onFinish}>
        <Row className="w-full overflow-x-auto md:overflow-visible">
          <Row className="w-full min-w-600px">
            <Row className="mmd w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
              <Col span={10} className="text-center">
                {t('assign.permission')}
              </Col>
              <Col span={10} className="text-center">
                {t('assign.role')}
              </Col>
              <Col span={4} className="text-center">
                {t('assign.action')}
              </Col>
            </Row>
            <Form.List name="permissions" initialValue={fetchPermissions?.data}>
              {(fields, {add, remove}) => (
                <>
                  <Row className="w-full p-3 border-1 border-gainsBoro border-solid">
                    <Col className="w-full">
                      <Button type="dashed" onClick={() => add({}, 0)} block icon={<PlusOutlined />}>
                        {t('add')}
                      </Button>
                    </Col>
                  </Row>
                  {map(fields, (field) => (
                    <Row
                      key={field.key}
                      className="w-full p-3 border-1 border-gainsBoro border-solid"
                      style={{borderTopWidth: 0}}>
                      <Form.Item
                        noStyle
                        {...field}
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.permission !== curValues.permission || prevValues.on_role !== curValues.on_role
                        }>
                        <Col span={10} className="pl-10">
                          <Form.Item
                            rules={[{required: true, message: t('messages.required')}]}
                            name={[field.name, 'permission']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'permission']}>
                            <MultiSelectPaginate
                              url="permissions/paginate"
                              urlName="permissions"
                              keyLabel="name"
                              keyValue="id"
                              showSearch
                              isGeneral={false}
                              className="w-full h-full"
                              placeholder={t('choose')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10} className="pl-10">
                          <Form.Item
                            name={[field.name, 'on_role']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'on_role']}>
                            <MultiSelectPaginate
                              url="roles/paginate"
                              urlName="roles"
                              keyLabel="name"
                              keyValue="id"
                              allowClear
                              isGeneral={false}
                              showSearch
                              className="w-full h-full"
                              placeholder={t('choose')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} className="flex justify-center">
                          <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                        </Col>
                      </Form.Item>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Row>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updatePermission.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditPermissionOnRole;
