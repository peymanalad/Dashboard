import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {CustomUpload, SimpleSelect} from 'components';
import {useHistory, useParams} from 'react-router-dom';
import {useFetch, useLogOut, usePost, useUser} from 'hooks';
import {getImageUrl, getLangSearchParam} from 'utils';
import {Card, Form, Checkbox, Button, Input, Row, Col} from 'antd';
import {SaveOutlined, LogoutOutlined} from '@ant-design/icons';
import map from 'lodash/map';
import filter from 'lodash/filter';

const EditUser: FC = () => {
  const {t} = useTranslation('user_create');
  const history = useHistory();
  const userInstance = useUser();
  const logOut = useLogOut();
  const {idUser} = useParams<{idUser: string}>();
  const user = useUser();

  const id = idUser || user.getId();

  const [form] = Form.useForm();

  const fetchUser = useFetch({
    url: 'services/app/User/GetUserForEdit',
    name: ['user', id],
    query: {Id: id},
    enabled: !!id
  });

  const sendPicture = usePost({
    url: 'services/app/Profile/UpdateProfilePicture',
    method: 'PUT'
  });

  const sendUser = usePost({
    url: 'services/app/User/CreateOrUpdateUser',
    method: 'POST',
    removeQueries: ['users', ['user', id, 'account']],
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
        ...val,
        isTwoFactorEnabled: false,
        password: val?.password || null,
        updateFileToken: val?.updateFileToken?.fileToken,
        id: +id
      }
    });
    sendPicture.post({userId: +id, fileToken: val?.updateFileToken?.fileToken});
  };

  return (
    <Form layout="vertical" requiredMark={false} form={form} className=" w-full" name="AccountInfo" onFinish={onFinish}>
      <Card
        title={t('edit_user')}
        bordered={false}
        className="w-full"
        loading={(id && !fetchUser?.data) || fetchUser.isFetching}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="roles"
              label={t('access_level')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={map(filter(fetchUser?.data?.roles, 'isAssigned'), 'roleId')}>
              <SimpleSelect
                keys="roleId"
                label="roleName"
                placeholder={t('choose')}
                mode="multiple"
                data={fetchUser?.data?.roles}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="username" label={t('username')} initialValue={fetchUser?.data?.user?.userName}>
              <Input className="ltr-input" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="updateFileToken"
              noStyle
              initialValue={
                fetchUser?.data?.profilePictureId && {
                  updateFileToken: fetchUser?.data?.profilePictureId,
                  url: getImageUrl(fetchUser?.data?.profilePictureId)
                }
              }>
              <CustomUpload type="users" name="image" mode="single" typeFile="image" hasCrop />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="name" label={t('first_name')} initialValue={fetchUser?.data?.user?.name || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="surname" label={t('last_name')} initialValue={fetchUser?.data?.user?.surname || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="phoneNumber" label={t('mobile')} initialValue={fetchUser?.data?.user?.phoneNumber}>
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
                  rules={[{pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/, message: t('validation.correctPassword')}]}>
                  <Input className="ltr-input" disabled={fields.getFieldValue('randomPassword')} />
                </Form.Item>
              </Col>
            )}
          </Form.Item>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="emailAddress"
              rules={[{type: 'email', message: t('validation.email')}]}
              label={t('email')}
              initialValue={fetchUser?.data?.user?.emailAddress || ''}>
              <Input type="email" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              name="shouldChangePasswordOnNextLogin"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchUser?.data?.user?.shouldChangePasswordOnNextLogin}>
              <Checkbox>{t('change_password_next_login')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              name="isActive"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchUser?.data?.user?.isActive}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              name="isLockoutEnabled"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchUser?.data?.user?.isLockoutEnabled}>
              <Checkbox>{t('lockout')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="my-5">
          <Col span={24} className="flex flex-col sm:flex-row items-center justify-between">
            {userInstance.isMySelf(id) && (
              <Button
                type="primary"
                htmlType="button"
                className="ml-auto w-full sm:w-unset"
                loading={logOut.isLoading}
                icon={<LogoutOutlined />}
                onClick={logOut.logOut}
                danger>
                {t('logout')}
              </Button>
            )}
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

export default EditUser;
