import React, {useState, useEffect, FC} from 'react';
import {Card, Form, Checkbox, Button, Input, Radio, Row, Col, Typography, InputNumber} from 'antd';
import {LogoutOutlined, SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomUpload, DateTimePicker, MultiSelect, MultiSelectPaginate, SimpleSelect} from 'components';
import {useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {getImageUrl, getLangSearchParam} from 'utils';
import map from 'lodash/map';
import filter from 'lodash/filter';
import {convertNumbers2English} from '../../../../utils/number';

const {Text} = Typography;

const AccountInfo: FC = () => {
  const {t} = useTranslation('user_create');
  const history = useHistory();
  const [form] = Form.useForm();
  const [role, setRole] = useState<number | null>(null);

  const getPermissions = useFetch({
    url: 'users/access_store',
    params: {role_id: role}
  });

  const sendPicture = usePost({
    url: 'services/app/Profile/UpdateProfilePicture',
    method: 'PUT'
  });

  const sendUser = usePost({
    url: 'services/app/User/CreateOrUpdateUser',
    method: 'POST',
    removeQueries: ['users'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/user/list'));
    }
  });

  const onFinish = (val: any) => {
    sendUser.post({
      assignedRoleNames: [],
      organizationUnits: [1],
      sendActivationEmail: false,
      setRandomPassword: val?.randomPassword,
      user: {
        id: null,
        ...val,
        phoneNumber: convertNumbers2English(val?.phoneNumber),
        username: convertNumbers2English(val?.phoneNumber),
        isTwoFactorEnabled: false,
        password: val?.password || null,
        updateFileToken: val?.updateFileToken?.fileToken
      }
    });
    // sendPicture.post({userId: +id, fileToken: val?.updateFileToken?.fileToken});
  };

  // useEffect(() => {
  //   if (role) getPermissions.refetch();
  // }, [role]);

  return (
    <Form layout="vertical" requiredMark={false} form={form} className=" w-full" name="AccountInfo" onFinish={onFinish}>
      <Card title={t('edit_user')} bordered={false} className="w-full">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="roles"
              label={t('access_level')}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelectPaginate
                mode="single"
                urlName="roles"
                url="services/app/Role/GetListOfRoles"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="username" label={t('username')}>
              <Input className="ltr-input" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item name="updateFileToken" noStyle>
              <CustomUpload type="users" name="image" mode="single" typeFile="image" hasCrop />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="name" label={t('first_name')}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="surname" label={t('last_name')}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="phoneNumber" label={t('mobile')}>
              <Input inputMode="tel" minLength={11} maxLength={11} className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="randomPassword" valuePropName="checked" className="m-0" initialValue={false}>
              <Checkbox>{t('random_password')}</Checkbox>
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, nextValues) => prevValues.randomPassword !== nextValues.randomPassword}>
            {(fields) => (
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="password"
                  label={t('password')}
                  rules={[
                    {pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/, message: t('validation.correctPassword')},
                    {min: 6, message: t('validation.minSixCharacter')}
                  ]}>
                  <Input className="ltr-input" disabled={fields.getFieldValue('randomPassword')} />
                </Form.Item>
              </Col>
            )}
          </Form.Item>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="emailAddress" rules={[{type: 'email', message: t('validation.email')}]} label={t('email')}>
              <Input type="email" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="shouldChangePasswordOnNextLogin" valuePropName="checked" className="m-0">
              <Checkbox>{t('change_password_next_login')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="isActive" valuePropName="checked" className="m-0">
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="isLockoutEnabled" valuePropName="checked" className="m-0">
              <Checkbox>{t('lockout')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="my-5">
          <Col span={24} className="flex flex-col sm:flex-row items-center justify-between">
            <Button
              className="sm:w-unset mr-auto my-4"
              type="primary"
              htmlType="submit"
              loading={sendUser.isLoading}
              icon={<SaveOutlined />}>
              {t('save')}
            </Button>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default AccountInfo;
