import React, {type FC} from 'react';
import {Card, Form, Row, Col, Input} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {FormActions, MultiSelectPaginate} from 'components';

const EditMemberShowList: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace('/news/member/list');
  };

  const fetchNewsUserMember = useFetch({
    name: ['groupMembers', id],
    url: 'services/app/GroupMembers/GetGroupMemberForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNewsUserMember = usePost({
    url: 'services/app/GroupMembers/CreateOrEdit',
    method: 'POST',
    removeQueries: ['groupMembers', ['groupMembers', id]],
    form,
    onSuccess: onBack
  });

  const onFinish = (values: any) => {
    storeNewsUserMember.post({
      id,
      memberPos: +values.memberPos,
      memberPosition: values.memberPosition,
      userId: values?.organizationUser?.id,
      organizationId: values?.organization?.id
    });
  };

  return (
    <Card
      title={t('news_member')}
      bordered={false}
      loading={(id && !fetchNewsUserMember?.data) || fetchNewsUserMember.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="memberPos"
              label={t('organization_position')}
              initialValue={fetchNewsUserMember?.data?.groupMember?.memberPos || 0}>
              <Input type="number" className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="memberPosition"
              label={t('organization_situation')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNewsUserMember?.data?.groupMember?.memberPosition}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
            shouldUpdate={(prevValues, nextValues) => prevValues.organization?.id !== nextValues.organization?.id}>
            {(fields) => (
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('user')}
                  name="organizationUser"
                  rules={[{required: true, message: t('messages.required')}]}
                  initialValue={
                    fetchNewsUserMember?.data?.groupMember?.userId
                      ? {
                          id: fetchNewsUserMember?.data?.groupMember?.userId,
                          displayName: fetchNewsUserMember?.data?.userName
                        }
                      : undefined
                  }>
                  <MultiSelectPaginate
                    mode="single"
                    urlName="usersSearch"
                    url="services/app/GroupMembers/GetAllUserForLookupTable"
                    params={{organizationId: fields.getFieldValue('organization')?.id}}
                    keyValue="id"
                    keyLabel="displayName"
                    placeholder={t('choose')}
                    showSearch
                    disabled={!!id || !fields.getFieldValue('organization')?.id}
                  />
                </Form.Item>
              </Col>
            )}
          </Form.Item>
        </Row>
        <FormActions isLoading={storeNewsUserMember.isLoading} onBack={onBack} />
      </Form>
    </Card>
  );
};

export default EditMemberShowList;
