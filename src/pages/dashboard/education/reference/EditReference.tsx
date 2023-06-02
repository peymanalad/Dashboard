import React, {FC} from 'react';
import {Button, Card, Col, Form, Input, Row} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CustomUpload} from 'components';
import {getLangSearchParam} from 'utils';

const EditReference: FC = () => {
  const {t} = useTranslation('reference');
  const {id} = useParams<{id?: string}>();
  const history = useHistory();

  const [form] = Form.useForm();

  const fetchReference = useFetch({
    name: ['reference', id],
    url: 'references/{id}',
    params: {id},
    enabled: !!id
  });

  const storeReference = usePost({
    url: '/references',
    method: 'POST',
    removeQueries: ['references'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/reference/list'));
    }
  });

  const updateReference = usePost({
    url: 'references/{id}',
    method: 'PATCH',
    removeQueries: ['references', ['reference', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/reference/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path;
    id ? updateReference.post(values, {}, {id}) : storeReference.post(values);
  };

  return (
    <Card
      title={t('reference')}
      bordered={false}
      loading={(id && !fetchReference?.data) || fetchReference.isFetching}
      className="w-full">
      <Form form={form} layout="vertical" name="reference" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full flex justify-between">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="name"
              label={t('name')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchReference?.data?.name}>
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{span: 24, order: 1}}
            md={{span: 12, order: 1}}
            lg={{span: 8, order: 2}}
            className="flex upload-center">
            <Form.Item
              name="picture"
              noStyle
              initialValue={
                fetchReference?.data?.picture_url && {
                  path: fetchReference?.data?.picture,
                  url: fetchReference?.data?.picture_url
                }
              }>
              <CustomUpload
                type="sources"
                name="image"
                mode="single"
                typeFile="image"
                imageHint
                hasCrop
                maxHeight={50}
                maxWidth={200}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={updateReference.isLoading || storeReference.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditReference;
