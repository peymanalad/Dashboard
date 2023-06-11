import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {MultiSelectPaginate} from 'components';

const EditNewsGroup: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchNewsGroup = useFetch({
    name: ['newsGroup', id],
    url: '/services/app/PostGroups/GetPostGroupForEdi',
    query: {Id: id},
    enabled: !!id
  });

  const storeNewsGroup = usePost({
    url: 'services/app/PostGroups/CreateOrEdit',
    method: 'POST',
    removeQueries: ['newsGroups'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/news/group/list');
    }
  });

  const onFinish = (values: any) => {
    storeNewsGroup.post({
      postGroupDescription: values?.postGroupDescription,
      organizationGroupId: values?.organizationGroup?.organizationGroup?.id
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
          <Col xs={24} md={12}>
            <Form.Item
              name="postGroupDescription"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNewsGroup?.data?.newsGroup?.groupName}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('organization_group')}
              name="organizationGroup"
              initialValue={{
                news: {
                  id: fetchNewsGroup?.data?.newsGroup?.newsId,
                  newsName: fetchNewsGroup?.data?.newsNewsName
                }
              }}>
              <MultiSelectPaginate
                mode="single"
                urlName="organizationGroups"
                url="services/app/OrganizationGroups/GetAll"
                keyPath={['organizationGroup']}
                keyValue="id"
                keyLabel="groupName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
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

export default EditNewsGroup;
