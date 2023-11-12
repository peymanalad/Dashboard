import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Checkbox, Divider} from 'antd';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {convertNumbers2English, getImageUrl, getLangSearchParam} from 'utils';
import {CustomUpload, FormActions} from 'components';

const EditOrganization: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const location = useLocation<any>();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchOrganization = useFetch({
    name: ['organization', id],
    url: 'services/app/Organizations/GetOrganizationForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const fetchOrganizationAdmin = useFetch({
    name: ['organization', 'admin', id],
    url: 'services/app/GroupMembers/GetAdminInformationByOrganization',
    query: {organizationId: id},
    enabled: !!id
  });

  const storeOrganization = usePost({
    url: '/services/app/User/CreateNode',
    method: 'POST',
    removeQueries: ['organizations', ['organization', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/organization/list');
    }
  });

  const updateOrganization = usePost({
    url: '/services/app/Organizations/CreateOrEdit',
    method: 'POST',
    removeQueries: ['organizations', ['organization', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/organization/list');
    }
  });

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace(getLangSearchParam('/user/list'));
  };

  const updateUser = usePost({
    url: 'services/app/User/CreateOrUpdateUser',
    method: 'POST',
    removeQueries: ['users', ['user', id]],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    if (!id) {
      return storeOrganization.post({
        organizationChartId: +location.state?.organization?.id,
        user: {
          ...values.user,
          phoneNumber: convertNumbers2English(values?.user?.phoneNumber),
          isActive: true
        },
        organization: {
          ...values.organization,
          organizationLogoToken: values?.organizationLogoToken?.fileToken
        }
      });
    }
    updateUser.post({
      assignedRoleNames: ['Admin'],
      organizationUnits: [1],
      sendActivationEmail: false,
      setRandomPassword: false,
      user: {
        ...values.user,
        emailAddress: fetchOrganizationAdmin?.data?.emailAddress,
        username: convertNumbers2English(values?.user?.phoneNumber),
        phoneNumber: convertNumbers2English(values?.user?.phoneNumber),
        roles: ['Admin'],
        isLockoutEnabled: 1,
        isTwoFactorEnabled: false,
        password: values.user?.password || null,
        id: +fetchOrganizationAdmin?.data?.userId
      }
    });
    updateOrganization.post({
      id: fetchOrganization?.data?.organization?.id,
      organizationName: values?.organization?.name,
      isGovernmental: values?.organization?.isGovernmental,
      nationalId: values?.organization?.nationalId,
      organizationContactPerson: values?.user?.phoneNumber,
      organizationPhone: values?.user?.phoneNumber,
      organizationLogoToken: values?.organizationLogoToken?.fileToken
    });
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchOrganization?.data) || fetchOrganization.isFetching || fetchOrganizationAdmin?.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="organization" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="organizationLogoToken"
              noStyle
              initialValue={
                fetchOrganization?.data?.organization?.organizationLogo && {
                  path: fetchOrganization?.data?.organization?.organizationLogo,
                  url: getImageUrl(fetchOrganization?.data?.organization?.organizationLogo)
                }
              }>
              <CustomUpload
                label={t('organizationLogo')}
                type="postGroups"
                name="image"
                mode="single"
                typeFile="image"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name={['organization', 'name']}
              label={t('organizationName')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={
                fetchOrganization?.data?.organization?.organizationName || location.state?.organization?.label
              }>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name={['organization', 'nationalId']}
              label={t('organization_nationalId')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.nationalId}>
              <Input type="number" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4} className="flex justify-center align-center">
            <Form.Item
              name={['organization', 'isGovernmental']}
              valuePropName="checked"
              initialValue={fetchOrganization?.data?.organization?.isGovernmental}>
              <Checkbox style={{lineHeight: '32px'}}>{t('isGovernmental')}</Checkbox>
            </Form.Item>
          </Col>
          <Divider orientation="left">{t('organization_ContactPerson')}</Divider>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'name']}
              label={t('first_name')}
              initialValue={fetchOrganizationAdmin?.data?.name || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'surname']}
              label={t('last_name')}
              initialValue={fetchOrganizationAdmin?.data?.surName || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'nationalId']}
              label={t('nationalId')}
              initialValue={fetchOrganizationAdmin?.data?.nationalId}>
              <Input inputMode="tel" minLength={10} maxLength={10} className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'phoneNumber']}
              label={t('username(phoneNumber)')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganizationAdmin?.data?.userName}>
              <Input inputMode="tel" minLength={11} maxLength={11} className="ltr-input" />
            </Form.Item>
          </Col>
          {/*<Col xs={24} md={12} lg={8}>*/}
          {/*  <Form.Item*/}
          {/*    name="organizationLocation"*/}
          {/*    label={t('location')}*/}
          {/*    rules={[{required: true, message: t('messages.required')}]}*/}
          {/*    initialValue={fetchOrganization?.data?.organization?.organizationLocation}>*/}
          {/*    <Input />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'password']}
              label={t('password')}
              rules={[
                {pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/, message: t('messages.correctPassword')},
                {min: 6, message: t('messages.minSixCharacter')}
              ]}>
              <Input className="ltr-input" type="password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="confirmPassword"
              label={t('confirmPassword')}
              rules={[
                ({getFieldValue}) => ({
                  validator(_, value) {
                    if (!value || getFieldValue(['user', 'password']) === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('messages.confirmPassword')));
                  }
                })
              ]}>
              <Input className="ltr-input" type="password" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="organization.comment"
              label={t('explain')}
              initialValue={fetchOrganization?.data?.organization?.comment}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <FormActions isLoading={storeOrganization.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditOrganization;
