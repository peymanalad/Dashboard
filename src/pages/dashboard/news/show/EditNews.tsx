import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';

const EditNews: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchNews = useFetch({
    name: ['news', id],
    url: 'services/app/Newss/GetNewsForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNews = usePost({
    url: '/services/app/Newss/CreateOrEdit',
    method: 'POST',
    removeQueries: ['news'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/news/news/list');
    }
  });

  const onFinish = (values: any) => {
    storeNews.post({...values, id: fetchNews?.data?.news?.id});
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchNews?.data) || fetchNews.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              name="newsName"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNews?.data?.news?.newsName}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={storeNews.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditNews;
