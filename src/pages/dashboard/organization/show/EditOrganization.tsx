import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {getImageUrl} from 'utils';
import {CustomUpload} from 'components';

const EditOrganization: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchOrganization = useFetch({
    name: ['organization', id],
    url: 'services/app/Organizations/GetOrganizationForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeOrganization = usePost({
    url: '/services/app/Organizations/CreateOrEdit',
    method: 'POST',
    removeQueries: ['organizations', ['organization', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/organization/list');
    }
  });

  const onFinish = (values: any) => {
    console.log(values);
    storeOrganization.post({
      ...values,
      organizationLogoToken: values?.organizationLogoToken?.fileToken,
      id: fetchOrganization?.data?.organization?.id
    });
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchOrganization?.data) || fetchOrganization.isFetching}
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
              <CustomUpload type="postGroups" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="organizationName"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.organizationName}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="nationalId"
              label={t('organization_nationalId')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.nationalId}>
              <Input type="number" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="organizationPhone"
              label={t('phone')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.organizationPhone}>
              <Input inputMode="tel" minLength={3} maxLength={15} className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="organizationContactPerson"
              label={t('organization_ContactPerson')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.organizationContactPerson}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="organizationLocation"
              label={t('location')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchOrganization?.data?.organization?.organizationLocation}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex justify-center align-center">
            <Form.Item name="isGovernmental" valuePropName="checked">
              <Checkbox style={{lineHeight: '32px'}}>{t('isGovernmental')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="comment" label={t('explain')} initialValue={fetchOrganization?.data?.comment}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeOrganization.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditOrganization;
