import React from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import {usePost, useFetch} from 'hooks';
import {SimpleSelect} from 'components';
import {FaqType} from 'assets';
import {getLangSearchParam} from 'utils';

const EditFaqGroup = () => {
  const {t} = useTranslation('setting');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchFaqGroup = useFetch({
    name: ['faqGroup', id],
    url: 'faq_groups/{id}',
    params: {id},
    enabled: !!id
  });

  const storeFaqGroup = usePost({
    url: 'faq_groups',
    method: 'POST',
    removeQueries: ['faqGroups'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/faqGroup/list'));
    }
  });

  const updateFaqGroup = usePost({
    url: 'faq_groups/{id}',
    method: 'PATCH',
    removeQueries: ['faqGroups', ['faqGroup', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/faqGroup/list'));
    }
  });

  const onFinish = (values: any) => {
    id ? updateFaqGroup.post(values) : storeFaqGroup.post(values);
  };

  return (
    <Card title={t('title')} bordered={false} loading={fetchFaqGroup.isFetching} className="w-full">
      <Form form={form} layout="vertical" name="faqGroup" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchFaqGroup?.data?.title}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="type"
              label={t('type')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchFaqGroup?.data?.type}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={map(FaqType, (value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateFaqGroup.isLoading || storeFaqGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditFaqGroup;
