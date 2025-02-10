import React, {FC} from 'react';
import {JSEncrypt} from 'jsencrypt';
import {Card, Form, Row, Col, Input, Checkbox, Divider} from 'antd';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {convertNumbers2English, getImageUrl, getLangSearchParam} from 'utils';
import {CustomUpload, FormActions, MultiSelectPaginate} from 'components';
import {passwordRegex} from 'assets';
import {publicKey} from 'assets/constants/keys';

const EditOrganization: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const location = useLocation<any>();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace(getLangSearchParam('/organization/organization/list'));
  };

  const fetchOrganization = useFetch({
    name: ['organization', id],
    url: 'services/app/Organizations/GetOrganizationForEdit',
    query: {Id: id},
    enabled: !!id
  });

  // const deleteDeedChart = usePost({
  //   url: 'services/app/DeedCharts/Delete',
  //   method: 'DELETE',
  //   showError: false
  // });

  const fetchOrganizationAdmin = useFetch({
    name: ['organization', 'admin', id],
    url: 'services/app/GroupMembers/GetAdminInformationByOrganization',
    query: {organizationId: id},
    enabled: !!id
  });

  const sendOrganizationFullNode = usePost({
    url: 'services/app/User/CreateFullNode',
    removeQueries: ['organizations', ['organization', id], 'OrganizationCharts'],
    form,
    onSuccess: onBack
  });

  const storeOrganization = usePost({
    url: '/services/app/User/CreateNode',
    method: 'POST',
    removeQueries: ['organizations', ['organization', id], 'OrganizationCharts'],
    form,
    onSuccess: onBack
  });

  const updateOrganization = usePost({
    url: '/services/app/Organizations/CreateOrEdit',
    method: 'POST',
    removeQueries: ['organizations', ['organization', id], 'OrganizationCharts'],
    form,
    onSuccess: onBack
  });

  const updateUser = usePost({
    url: 'services/app/User/CreateOrUpdateUser',
    method: 'POST',
    removeQueries: ['users', ['user', id]],
    form
    // onSuccess: onBack
  });

  const onFinish = (values: any, organizationChartId?: number) => {
    if (!!values?.organization?.parent?.deedChart?.id && !organizationChartId)
      return sendOrganizationFullNode.post({
        organizationChartId: organizationChartId || +location.state?.organization?.id,
        user: {
          ...values.user,
          phoneNumber: convertNumbers2English(values?.user?.phoneNumber),
          isActive: true
        },
        organization: {
          ...values.organization,
          organizationLogoToken: values?.organizationLogoToken?.fileToken
        },
        deedChartParentId: values?.organization?.parent?.deedChart?.id,
        deedChartCaption: values?.organization?.name
      });
    if (!id) {
      return storeOrganization.post({
        organizationChartId: organizationChartId || +location.state?.organization?.id,
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
    if (!!fetchOrganizationAdmin?.data?.userId) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const encryptedPassword = !!values.user?.password ? encrypt.encrypt(values.user?.password) : null;

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
          password: encryptedPassword || null,
          id: +fetchOrganizationAdmin?.data?.userId
        }
      });
    }
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
          {!location.state?.organization?.id && !id && (
            <Col xs={24}>
              <Form.Item
                label={t('parentOrganization')}
                name={['organization', 'parent']}
                rules={[{required: true, message: t('messages.required')}]}>
                <MultiSelectPaginate
                  mode="single"
                  urlName="OrganizationCharts"
                  url="services/app/DeedCharts/GetAll"
                  keyPath={['deedChart']}
                  renderCustomLabel={(option) => option?.deedChart?.leafCationPath || option?.deedChart?.caption}
                  keyValue="id"
                  keyLabel="caption"
                  placeholder={t('choose')}
                  showSearch={false}
                />
              </Form.Item>
            </Col>
          )}
          <Divider orientation="left">{t('organization_ContactPerson')}</Divider>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'name']}
              label={t('first_name')}
              initialValue={fetchOrganizationAdmin?.data?.name || ''}>
              <Input autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['user', 'surname']}
              label={t('last_name')}
              initialValue={fetchOrganizationAdmin?.data?.surName || ''}>
              <Input autoComplete="off" />
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
              <Input inputMode="tel" minLength={11} maxLength={11} className="ltr-input" autoComplete="off" />
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
                {required: true, message: t('validation.required')},
                {pattern: passwordRegex, message: t('validation.correctPassword')},
                {min: 8, message: t('validation.minEightCharacter')},
                {max: 20, message: t('validation.maxTwentyCharacter')}
              ]}>
              <Input className="ltr-input" type="password" autoComplete="off" />
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
              <Input className="ltr-input" type="password" autoComplete="off" />
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
        <FormActions isLoading={storeOrganization.isLoading || sendOrganizationFullNode.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditOrganization;
