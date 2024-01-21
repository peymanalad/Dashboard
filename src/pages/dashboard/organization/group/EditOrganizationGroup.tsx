import React, {FC} from 'react';
import {Card, Form, Row, Col, Input} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, FormActions, MultiSelectPaginate} from 'components';
import {getImageUrl} from 'utils';
import SelectOrganization from 'containers/organization/SelectOrganization';

const EditOrganizationGroup: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace('/organization/group/list');
  };

  const fetchNewsGroup = useFetch({
    name: ['postGroups', id],
    url: '/services/app/PostGroups/GetPostGroupForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNewsGroup = usePost({
    url: 'services/app/PostGroups/CreateOrEdit',
    method: 'POST',
    removeQueries: ['postGroups', ['postGroups', id]],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    storeNewsGroup.post({
      id,
      groupFileToken: values?.groupFileToken?.fileToken,
      postGroupDescription: values?.postGroupDescription,
      organizationId: values?.organization?.id || values?.organization
    });
  };

  return (
    <Card
      title={t('news_groups')}
      bordered={false}
      loading={(id && !fetchNewsGroup?.data) || fetchNewsGroup.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="groupFileToken"
              noStyle
              initialValue={
                fetchNewsGroup?.data?.postGroup?.groupFile && {
                  path: fetchNewsGroup?.data?.postGroup?.groupFile,
                  url: getImageUrl(fetchNewsGroup?.data?.postGroup?.groupFile)
                }
              }>
              <CustomUpload type="postGroups" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="postGroupDescription"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNewsGroup?.data?.postGroup?.postGroupDescription}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('organization_group')}
              name="organization"
              initialValue={fetchNewsGroup?.data?.postGroup?.organizationId}
              rules={[{required: true, message: t('messages.required')}]}>
              <SelectOrganization />
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, nextValues) => {
              if (prevValues.organization !== nextValues.organization) {
                form.setFieldsValue({
                  users: null
                });
                return true;
              }
              return false;
            }}>
            {(fields) => {
              const organization = fields.getFieldValue('organization');
              return (
                <Col xs={24} md={12} lg={24}>
                  <Form.Item label={t('usersThatShowNewsGroup')} name="users">
                    <MultiSelectPaginate
                      mode="multiple"
                      urlName={['organization', 'groupMembers', id]}
                      url="services/app/GroupMembers/GetAll"
                      params={{organizationId: organization}}
                      renderCustomLabel={(option) => {
                        return `${option?.userName} ${
                          option?.groupMember?.memberPosition ? `- ${option?.groupMember?.memberPosition}` : ''
                        }`;
                      }}
                      disabled={!organization}
                      keyPath={['groupMember']}
                      keyValue="id"
                      keyLabel="memberPosition"
                      placeholder={t('choose')}
                      showSearch={false}
                    />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        <FormActions isLoading={storeNewsGroup.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditOrganizationGroup;
