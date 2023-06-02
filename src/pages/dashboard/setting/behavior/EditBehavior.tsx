import React, {FC} from 'react';
import {Card, Row, Col, Form, Input, Button, InputNumber} from 'antd';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {SaveOutlined} from '@ant-design/icons';
import {getLangSearchParam} from 'utils';

const EditBehavior: FC = () => {
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('setting');

  const [form] = Form.useForm();

  const fetchBehavior = useFetch({
    name: ['behavior', id],
    url: 'behaviors/{id}',
    params: {id},
    enabled: !!id
  });

  const updateBehavior = usePost({
    url: 'behaviors/{id}',
    method: 'PATCH',
    removeQueries: ['behaviors', ['behavior', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/behavior/list'));
    }
  });

  const storeBehavior = usePost({
    url: 'behaviors',
    method: 'POST',
    removeQueries: ['behaviors'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/behavior/list'));
    }
  });

  const onFinish = (values: any) => {
    id ? updateBehavior.post(values) : storeBehavior.post(values);
  };

  return (
    <Card title={t('behavior')} bordered={false} loading={fetchBehavior.isFetching} className="w-full">
      <Form form={form} layout="vertical" name="setting" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} lg={12}>
            <Form.Item
              name="title"
              label={t('title')}
              initialValue={fetchBehavior?.data?.title}
              rules={[{required: true, message: t('messages.required')}]}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="value"
              label={t('value')}
              initialValue={fetchBehavior?.data?.value}
              rules={[{required: true, message: t('messages.required')}]}>
              <InputNumber className="w-full" minLength={0} maxLength={4} min={0} max={5000} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label={t('description')} initialValue={fetchBehavior?.data?.description}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeBehavior.isLoading || storeBehavior.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditBehavior;
