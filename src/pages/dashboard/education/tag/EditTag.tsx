import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, SimpleSelect} from 'components';
import {is_confirm} from 'assets';
import {getLangSearchParam} from 'utils';

const EditTag: FC = () => {
  const {t} = useTranslation('tag');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchTag = useFetch({
    name: ['tag', id],
    url: 'tags/{id}',
    params: {id},
    enabled: !!id
  });

  const storeTag = usePost({
    url: '/tags',
    method: 'POST',
    removeQueries: ['tags'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/tag/list'));
    }
  });

  const updateTag = usePost({
    url: 'tags/{id}',
    method: 'PATCH',
    removeQueries: ['tags', ['tag', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/tag/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path;
    id ? updateTag.post(values, {}, {id}) : storeTag.post(values);
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={(id && !fetchTag?.data) || fetchTag.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="tag" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchTag?.data?.name}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
            <Form.Item
              name="is_confirm"
              label={t('status')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchTag?.data?.is_confirm}>
              <SimpleSelect
                keys="id"
                label="name_fa"
                data={is_confirm?.map((value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col
            xs={{span: 24, order: 1}}
            md={{span: 12, order: 1}}
            lg={{span: 8, order: 3}}
            className="flex upload-center">
            <Form.Item
              name="picture"
              noStyle
              initialValue={
                fetchTag?.data?.picture_url && {
                  path: fetchTag?.data?.picture,
                  url: fetchTag?.data?.picture_url
                }
              }>
              <CustomUpload type="recommendations" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col span={24} order={4}>
            <Form.Item
              name="description"
              label={t('description')}
              className="w-full"
              initialValue={fetchTag?.data?.description}>
              <Input.TextArea className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={updateTag.isLoading || storeTag.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditTag;
