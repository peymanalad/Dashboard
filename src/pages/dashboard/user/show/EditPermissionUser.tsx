import React from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Row, Col, Button, Form} from 'antd';
import {MultiSelectPaginate, SimpleSelect} from 'components';
import {PlusOutlined, DeleteOutlined, SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {permissionUserProps} from 'types/permission';
import map from 'lodash/map';
import {PermissionStatus} from 'assets';
import {getLangSearchParam} from 'utils';

const SchemeCare = () => {
  const {id} = useParams<{id?: string}>();
  const history = useHistory();

  const {t} = useTranslation('permission');

  const fetchPermissions = useFetch({
    name: ['permissions', 'userAssign', id],
    url: 'permissions/assign',
    params: {user_id: id},
    enabled: true
  });

  const updatePermission = usePost({
    url: 'permissions/assign',
    removeQueries: [['permissions', 'userAssign', id]],
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/user/list'));
    }
  });

  const onFinish = (values: any) => {
    values.user_id = id;
    values.permissions = map(values?.permissions, (val: permissionUserProps) => {
      return {
        permission_id: val?.permission?.id,
        can: val?.can
      };
    });
    updatePermission.post(values);
  };

  return (
    <Card title={t('edit_permission')} loading={fetchPermissions.isFetching} bordered={false} className="w-full">
      <Form className="flex-center w-full flex-col" onFinish={onFinish}>
        <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
          <Col span={10} className="text-center">
            {t('assign.permission')}
          </Col>
          <Col span={10} className="text-center">
            {t('assign.type')}
          </Col>
          <Col span={4} className="text-center">
            {t('assign.action')}
          </Col>
        </Row>
        <Form.List name="permissions" initialValue={fetchPermissions?.data}>
          {(fields, {add, remove}) => (
            <>
              <Row gutter={[16, 8]} className="w-full p-3 border-1 border-gainsBoro border-solid">
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
                  <Form.Item noStyle {...field}>
                    <Col span={10} className="w-full pl-10">
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
                    <Col span={10}>
                      <Form.Item
                        rules={[{required: true, message: t('messages.required')}]}
                        name={[field.name, 'can']}
                        className="no-validate-message"
                        fieldKey={[field?.name, 'can']}>
                        <SimpleSelect keys="id" label="name" placeholder={t('choose')} data={PermissionStatus} />
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
        <Button
          className="my-5 self-end"
          loading={updatePermission.isLoading}
          htmlType="submit"
          type="primary"
          icon={<SaveOutlined />}>
          {t('save')}
        </Button>
      </Form>
    </Card>
  );
};

export default SchemeCare;
