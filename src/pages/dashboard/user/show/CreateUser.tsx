import React, {type FC} from 'react';
import {Card, Form, Checkbox, Input, Row, Col, Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import {CustomUpload, FormActions, MultiSelectPaginate} from 'components';
import {useHistory} from 'react-router-dom';
import {usePost, useUser} from 'hooks';
import {getLangSearchParam, convertNumbers2English} from 'utils';

const AccountInfo: FC = () => {
  const {t} = useTranslation('user_create');
  const history = useHistory();
  const {isSuperUser} = useUser();
  const [form] = Form.useForm();

  const checkSetOrganization = (id: number) => {
    const formValues = form.getFieldsValue();
    Modal.success({
      title: t('chooseOrganization'),
      content: t('areYouSetOrganizationForUser'),
      okType: 'primary',
      centered: true,
      okText: t('yes'),
      className: 'delete',
      cancelText: t('no'),
      okCancel: true,
      onCancel: onBack,
      onOk: () =>
        history.replace(getLangSearchParam('/news/member/create'), {
          user: {displayName: `${formValues?.name} ${formValues?.surname}`, id}
        })
    });
  };

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace(getLangSearchParam('/user/list'));
  };

  const sendPicture = usePost({
    url: 'services/app/Profile/UpdateProfilePicture',
    method: 'PUT',
    onSuccess: onBack
  });

  const sendUser = usePost({
    url: 'services/app/User/CreateOrUpdateUser',
    method: 'POST',
    removeQueries: ['users'],
    form,
    onSuccess: (userId) => {
      const fileToken = form.getFieldValue('updateFileToken')?.fileToken;
      if (fileToken) sendPicture.post({userId: +userId, fileToken});
      if (isSuperUser()) checkSetOrganization(+userId);
      else onBack();
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
        isLockoutEnabled: 1,
        phoneNumber: convertNumbers2English(val?.phoneNumber),
        username: convertNumbers2English(val?.phoneNumber),
        isTwoFactorEnabled: false,
        password: val?.password || null,
        updateFileToken: val?.updateFileToken?.fileToken
      }
    });
  };

  return (
    <Form layout="vertical" requiredMark={false} form={form} className=" w-full" name="AccountInfo" onFinish={onFinish}>
      <Card title={t('edit_user')} bordered={false} className="w-full">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="roles"
              label={t('access_level')}
              rules={[{required: true, message: t('validation.required')}]}>
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
            <Form.Item
              name="name"
              label={t('first_name')}
              rules={[{required: true, message: t('validation.required')}]}>
              <Input autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="surname"
              label={t('last_name')}
              rules={[{required: true, message: t('validation.required')}]}>
              <Input autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="phoneNumber"
              label={t('mobile')}
              rules={[
                {required: true, message: t('validation.required')},
                {pattern: /^\d{11}$/, message: t('validation.mobile')}
              ]}>
              <Input inputMode="tel" minLength={11} maxLength={11} className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="nationalId"
              label={t('nationalId')}
              rules={[{pattern: /^\d{10}$/, message: t('validation.nationalCode')}]}>
              <Input inputMode="tel" minLength={10} maxLength={10} className="ltr-input" />
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
                    {required: true, message: t('validation.required')},
                    {pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/, message: t('validation.correctPassword')},
                    {min: 6, message: t('validation.minSixCharacter')}
                  ]}>
                  <Input className="ltr-input" disabled={fields.getFieldValue('randomPassword')} autoComplete="off" />
                </Form.Item>
              </Col>
            )}
          </Form.Item>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="emailAddress"
              rules={[
                {required: true, message: t('validation.required')},
                {type: 'email', message: t('validation.email')}
              ]}
              label={t('email')}>
              <Input type="email" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="randomPassword" valuePropName="checked" className="m-0" initialValue={false}>
              <Checkbox>{t('random_password')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="shouldChangePasswordOnNextLogin" valuePropName="checked" className="m-0">
              <Checkbox>{t('change_password_next_login')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item name="isActive" valuePropName="checked" className="m-0" initialValue>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <FormActions isLoading={sendUser.isLoading || sendPicture.isLoading} onBack={onBack} />
      </Card>
    </Form>
  );
};

export default AccountInfo;
