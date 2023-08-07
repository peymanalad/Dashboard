import React from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {MultiSelectPaginate} from 'components';
import {getLangSearchParam} from 'utils';

const EditFaq = () => {
  const {t} = useTranslation('setting');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchFaq = useFetch({
    name: ['faq', id],
    url: 'faqs/{id}',
    params: {id},
    enabled: !!id
  });

  const storeFaq = usePost({
    url: 'faqs',
    method: 'POST',
    removeQueries: ['faqs'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/faq/list'));
    }
  });

  const updateFaq = usePost({
    url: 'faqs/{id}',
    method: 'PATCH',
    removeQueries: ['faqs', ['faq', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/faq/list'));
    }
  });

  const onFinish = (values: any) => {
    values.faq_group_id = values?.faq_group_id?.id;
    id ? updateFaq.post(values, {}, {id}) : storeFaq.post(values);
  };

  return (
    <Card title={t('faqs')} bordered={false} loading={fetchFaq.isFetching} className="w-full">
      <Form form={form} layout="vertical" name="faq" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} lg={12}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchFaq?.data?.title}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={t('group')}
              name="faq_group_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchFaq?.data?.faq_group}>
              <MultiSelectPaginate
                url="faq_groups/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="faq_groups"
                isGeneral={false}
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('description')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchFaq?.data?.description}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeFaq.isLoading || updateFaq.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditFaq;
