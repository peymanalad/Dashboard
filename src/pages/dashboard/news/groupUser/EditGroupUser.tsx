import React, {type FC} from 'react';
import {Card, Form, Row, Col, Input} from 'antd';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {FormActions, MultiSelectPaginate} from 'components';
import {queryStringToObject} from 'utils';

const EditNewsGroupUser: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const location = useLocation<any>();
  const user = location.state?.user;
  const {id} = useParams<{id?: string}>();
  const queryObject = queryStringToObject(location.search);

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace('/news/group/user/list');
  };

  const fetchNewsUserMember = useFetch({
    name: ['userPostGroup', id],
    url: 'services/app/AllowedUserPostGroups/GetAllowedUserPostGroupForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNewsUserMember = usePost({
    url: 'services/app/AllowedUserPostGroups/CreateOrEdit',
    method: 'POST',
    removeQueries: ['userPostGroup', ['userPostGroup', id]],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    storeNewsUserMember.post({
      id,
      userId: values?.organizationUser?.groupMember?.userId,
      postGroupId: values.postGroupId?.id,
      organizationId: values?.organization?.id
    });
  };

  return (
    <Card
      title={t('newsGroupUsers')}
      bordered={false}
      loading={(id && !fetchNewsUserMember?.data) || fetchNewsUserMember.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              label={t('organization')}
              name="organization"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={
                fetchNewsUserMember?.data?.groupMember?.organizationId
                  ? {
                      id: fetchNewsUserMember?.data?.groupMember?.organizationId,
                      displayName: fetchNewsUserMember?.data?.organizationGroupGroupName
                    }
                  : +queryObject?.organization?.id > 0
                  ? {id: +queryObject?.organization?.id, displayName: queryObject?.organization?.name}
                  : undefined
              }>
              <MultiSelectPaginate
                mode="single"
                urlName="organizationGroupsSearch"
                url="services/app/GroupMembers/GetAllOrganizationGroupForLookupTable"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch
                disabled={!!id}
              />
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, nextValues) => {
              if (prevValues.organization?.id !== nextValues.organization?.id && !user) {
                form.setFieldValue('organizationUser', null);
                form.setFieldValue('postGroupId', null);
                return true;
              }
              return false;
            }}>
            {(fields) => {
              const organizationId = fields.getFieldValue('organization')?.id;
              return (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('user')}
                      name="organizationUser"
                      rules={[{required: true, message: t('messages.required')}]}
                      initialValue={
                        fetchNewsUserMember?.data?.userPostGroup?.userId
                          ? {
                              id: fetchNewsUserMember?.data?.userPostGroup?.userId,
                              userName: fetchNewsUserMember?.data?.userName
                            }
                          : user
                      }>
                      <MultiSelectPaginate
                        mode="single"
                        urlName={['organization', 'groupMembers', organizationId]}
                        url="services/app/GroupMembers/GetAll"
                        params={{organizationId}}
                        renderCustomLabel={(option) => {
                          return `${option?.userName} ${
                            option?.groupMember?.memberPosition ? `- ${option?.groupMember?.memberPosition}` : ''
                          }`;
                        }}
                        keyPath={['groupMember']}
                        keyValue="id"
                        keyLabel="memberPosition"
                        placeholder={t('choose')}
                        showSearch={false}
                        disabled={!!id || !organizationId}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('news_group')}
                      name="postGroupId"
                      initialValue={
                        !!fetchNewsUserMember?.data?.userPostGroup?.postGroupId
                          ? {
                              id: fetchNewsUserMember?.data?.userPostGroup?.postGroupId,
                              displayName: fetchNewsUserMember?.data?.postGroupPostGroupDescription,
                              organizationName: fetchNewsUserMember?.data?.organizationName || ''
                            }
                          : undefined
                      }>
                      <MultiSelectPaginate
                        mode="single"
                        urlName={['newsGroupSearch', organizationId]}
                        url="services/app/Posts/GetAllPostGroupForLookupTable"
                        params={{organizationId}}
                        disabled={!organizationId}
                        searchKey="Filter"
                        showSearch
                        keyValue="id"
                        keyLabel="displayName"
                        renderCustomLabel={(option) =>
                          !!option?.displayName ? `${option?.displayName} - ${option?.organizationName}` : ''
                        }
                        placeholder={t('choose')}
                      />
                    </Form.Item>
                  </Col>
                </>
              );
            }}
          </Form.Item>
        </Row>
        <FormActions isLoading={storeNewsUserMember.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditNewsGroupUser;
