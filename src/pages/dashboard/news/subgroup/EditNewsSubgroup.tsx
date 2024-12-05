import React, {FC} from 'react';
import {Card, Form, Row, Col, Input} from 'antd';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, FormActions, MultiSelectPaginate} from 'components';
import {getImageUrl} from 'utils';

const EditOrganizationSubgroup: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const location = useLocation<any>();
  const postGroup = location?.state?.postGroup;

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace({pathname: '/news/subGroup/list', state: {postGroup}});
  };

  const fetchNewsSubGroup = useFetch({
    name: ['postSubGroups', id],
    url: '/services/app/PostSubGroups/GetPostSubGroupForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNewsGroup = usePost({
    url: 'services/app/PostSubGroups/CreateOrEdit',
    method: 'POST',
    removeQueries: ['postSubGroups', ['postSubGroups', id]],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    storeNewsGroup.post({
      id,
      subGroupFileToken: values?.subGroupFileToken?.fileToken,
      postSubGroupDescription: values?.postSubGroupDescription,
      postGroupId: values?.postGroupId?.postGroup?.id || values?.postGroupId
    });
  };

  return (
    <Card
      title={t('news_subgroups_group', {group: `${postGroup?.name} - ${postGroup?.organizationName || '-'}`})}
      bordered={false}
      loading={(id && !fetchNewsSubGroup?.data) || fetchNewsSubGroup.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="subGroupFileToken"
              noStyle
              initialValue={
                fetchNewsSubGroup?.data?.postSubGroup?.subGroupFile && {
                  path: fetchNewsSubGroup?.data?.postSubGroup?.subGroupFile,
                  url: getImageUrl(fetchNewsSubGroup?.data?.postSubGroup?.subGroupFile)
                }
              }>
              <CustomUpload type="postSubGroups" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="postSubGroupDescription"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNewsSubGroup?.data?.postSubGroup?.postSubGroupDescription}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('organization_group')}
              name="postGroupId"
              initialValue={{
                postGroup: {id: postGroup?.id, postGroupDescription: postGroup?.name},
                organizationGroupGroupName: postGroup?.organizationName
              }}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelectPaginate
                mode="single"
                urlName={['postGroups']}
                url="services/app/PostGroups/GetAll"
                renderCustomLabel={(option) => {
                  return `${option?.postGroup?.postGroupDescription} - ${option?.organizationGroupGroupName || ''}`;
                }}
                keyPath={['postGroup']}
                disabled
                keyValue="id"
                keyLabel="postGroupDescription"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <FormActions isLoading={storeNewsGroup.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditOrganizationSubgroup;
