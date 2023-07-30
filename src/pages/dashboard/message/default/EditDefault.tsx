import React from 'react';
import {Spin, Card, Row, Form, Col, Button, Input, Radio} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {SaveOutlined} from '@ant-design/icons';
import {MultiSelectPaginate} from 'components';
import isUndefined from 'lodash/isUndefined';
import {defaultMessageOptionProps} from 'types/message';
import {getLangSearchParam} from 'utils';

const EditCare = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('message');
  const history = useHistory();

  const [form] = Form.useForm();

  const fetchDefaultMessage = useFetch({
    url: '/default_question_messages/{id}',
    params: {id},
    name: ['default_question_message', id],
    enabled: !!id
  });

  const fetchOptions = useFetch({
    url: '/questions/{id}/options',
    isGeneral: true
  });

  const updateDefaultMessage = usePost({
    url: '/default_question_messages/{id}',
    method: 'PATCH',
    removeQueries: ['default_question_message', ['default_question_message', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/message/default/list'));
    }
  });

  const createDefaultMessage = usePost({
    url: 'default_question_messages',
    method: 'POST',
    removeQueries: ['default_question_message'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/message/default/list'));
    }
  });

  const onFinish = (values: any) => {
    values.question_id = values?.question?.id;
    id ? updateDefaultMessage.post(values, {}, {id}) : createDefaultMessage.post(values);
  };

  return (
    <Card
      title={t('defaultMessage')}
      className="my-6"
      loading={!isUndefined(id) && (fetchDefaultMessage?.isFetching || !fetchDefaultMessage?.data)}>
      <Form form={form} name="defaultMessage" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              label={t('question')}
              name="question"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchDefaultMessage?.data?.question}>
              <MultiSelectPaginate
                url="questions/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="questions"
                isGeneral
                allowClear
                onChange={(items: object) => fetchOptions.fetch(items)}
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          {fetchOptions?.isFetching ? (
            <Spin size="small" />
          ) : (
            <Col span={24}>
              <Form.Item
                name="value"
                label={t('options')}
                initialValue={fetchDefaultMessage?.data?.value?.toString()}
                rules={[{required: true, message: t('messages.required')}]}>
                <Radio.Group>
                  {(fetchOptions?.data || fetchDefaultMessage?.data?.question?.options)?.map(
                    (option: defaultMessageOptionProps) => (
                      <Radio value={option?.value} key={option?.id}>
                        {option?.name}
                      </Radio>
                    )
                  )}
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item
              label={t('message')}
              name="message"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchDefaultMessage?.data?.message}>
              <Input.TextArea rows={3} placeholder={t('empty')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={createDefaultMessage?.isLoading || updateDefaultMessage?.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditCare;
