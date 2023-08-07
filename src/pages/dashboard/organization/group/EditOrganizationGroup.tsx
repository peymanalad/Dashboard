import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, MultiSelectPaginate} from 'components';
import {getImageUrl} from 'utils';

const EditOrganizationGroup: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

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
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/organization/group/list');
    }
  });

  const onFinish = (values: any) => {
    storeNewsGroup.post({
      id,
      groupFileToken: values?.groupFileToken?.fileToken,
      postGroupDescription: values?.postGroupDescription,
      organizationId: values?.organization?.id
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
              initialValue={{
                id: fetchNewsGroup?.data?.postGroup?.organizationId,
                displayName: fetchNewsGroup?.data?.organizationGroupGroupName
              }}>
              <MultiSelectPaginate
                mode="single"
                urlName="organizationGroupsSearch"
                url="services/app/GroupMembers/GetAllOrganizationGroupForLookupTable"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeNewsGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditOrganizationGroup;
