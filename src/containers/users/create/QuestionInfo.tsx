import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Button, Row, Col, Form, Typography} from 'antd';
import {PlusOutlined, DeleteOutlined, SaveOutlined, QuestionOutlined} from '@ant-design/icons';
import {DrillDownMenu, MultiSelect, MultiSelectPaginate, TagSelect} from 'components';
import forEach from 'lodash/forEach';
import reverse from 'lodash/reverse';
import get from 'lodash/get';
import cloneWith from 'lodash/cloneWith';

interface Props {
  id?: number | string;
}

const {Text} = Typography;

const QuestionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('question');
  const [form] = Form.useForm();

  const fetchAlertQuestion = useFetch({
    url: '/users/{id}/alert_questions',
    name: ['user', id, 'alert'],
    params: {id},
    enabled: true
  });

  const updateAlertQuestion = usePost({
    url: '/users/{id}/alert_questions',
    method: 'POST',
    removeQueries: [['user', id, 'alert']],
    form
  });

  const onFinish = (values: any) => {
    const formData = new FormData();
    forEach(values?.alert_questions, (question) => {
      formData.append(`alert_questions[${question?.question?.id}][value]`, question?.option?.id);
    });
    forEach(values?.extra_questions, (question, index) => {
      formData.append(`extra_questions[${index}]`, question);
    });
    updateAlertQuestion.post(formData);
  };

  return (
    <Row>
      <Card bordered={false} className="w-full">
        <Row gutter={[16, 8]} justify="center">
          <Col xs={24} md={22} lg={16} xl={10}>
            <DrillDownMenu
              moreActionPreTitle={t('questions')}
              mode="multiple"
              url={`/users/${id}/diseases`}
              urlName={`/users_${id}_diseases`}
              keyLabel="name"
              keyValue="id"
              notSelectParent
              notSelectChild
              moreActionKeyLabel="title"
              moreActionKeyValue="id"
              moreActionSelectKey="is_selected"
              selectedItems={null}
              moreActionUrl={`/users/${id}/questions`}
              moreActionUrlPost={`/users/${id}/questions`}
              moreActionUrlName={`users_${id}_questions`}
              moreActionIcon={<QuestionOutlined style={{color: 'blue'}} />}
              showSearch
              scrollHeight="55vh"
            />
          </Col>
        </Row>
      </Card>
      <Card
        title={t('alert_questions')}
        bordered={false}
        loading={fetchAlertQuestion.isFetching}
        className="w-full my-3">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className=" w-full"
          name="questionInfo"
          onFinish={onFinish}>
          <Row className="w-full overflow-x-auto md:overflow-visible">
            <Row className="w-full min-w-600px">
              <Row gutter={[16, 8]} className="w-full p-3 mx-2 bg-snow border-1 border-gainsBoro border-solid">
                <Col span={16} className="text-center">
                  {t('question')}
                </Col>
                <Col span={6} className="text-center">
                  {t('answer')}
                </Col>
                <Col span={2} className="text-center">
                  {t('action')}
                </Col>
              </Row>
              <Form.List name="alert_questions" initialValue={fetchAlertQuestion?.data?.alert_questions}>
                {(fields, {add, remove}) => (
                  <>
                    <Row gutter={[16, 8]} className="w-full p-3 mx-3 border-1 border-gainsBoro border-solid">
                      <Col className="w-full">
                        <Button
                          type="dashed"
                          disabled={!fetchAlertQuestion?.data?.permissions?.alert_questions}
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}>
                          {t('addAlertQuestion')}
                        </Button>
                      </Col>
                    </Row>
                    {reverse(fields)?.map((field) => (
                      <Row
                        gutter={[16, 8]}
                        key={field.key}
                        className="w-full p-3 border-1 border-gainsBoro border-solid"
                        style={{borderTopWidth: 0}}>
                        <Col span={16}>
                          <Form.Item
                            rules={[{required: true, message: t('messages.required')}]}
                            name={[field.name, 'question']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'question']}>
                            <MultiSelectPaginate
                              url={`users/${id}/questions/paginate`}
                              urlName={`users_${id}_questions_paginate`}
                              keyLabel="title"
                              keyValue="id"
                              showSearch
                              listHeight={200}
                              disabled={!fetchAlertQuestion?.data?.permissions?.alert_questions}
                              onChange={() => {
                                form.setFieldsValue({
                                  alert_questions: cloneWith(form.getFieldsValue()?.alert_questions, (value) => {
                                    value[field?.name].option = undefined;
                                    return value;
                                  })
                                });
                              }}
                              isGeneral={false}
                              className="w-full h-full"
                              placeholder={t('choose')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, nextValues) =>
                              prevValues.question?.id !== nextValues.question?.id
                            }>
                            <Form.Item
                              rules={[{required: true}]}
                              name={[field.name, 'option']}
                              className="no-validate-message"
                              fieldKey={[field?.name, 'option']}>
                              <MultiSelect
                                url={`questions/${get(form.getFieldValue('alert_questions'), [
                                  field?.name,
                                  'question',
                                  'id'
                                ])}/options`}
                                urlName={`questions_${get(form.getFieldValue('alert_questions'), [
                                  field?.name,
                                  'question',
                                  'id'
                                ])}_options`}
                                keyValue="id"
                                keyLabel="name"
                                listHeight={200}
                                disabled={!fetchAlertQuestion?.data?.permissions?.alert_questions}
                                placeholder={t('choose')}
                                isGeneral
                              />
                            </Form.Item>
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center items-center">
                          <Button
                            danger
                            type="primary"
                            disabled={!fetchAlertQuestion?.data?.permissions?.alert_questions}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </Row>
          </Row>
          <Row gutter={[16, 8]} className="mt-3">
            <Col span={24}>
              <Form.Item
                label={t('extra_questions')}
                name="extra_questions"
                extra={
                  <Text className="text-sm" type="secondary">
                    {t('extraQuestionsDescription')}
                  </Text>
                }
                initialValue={fetchAlertQuestion?.data?.extra_questions}>
                <TagSelect disabled={!fetchAlertQuestion?.data?.permissions?.extra_questions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} className="w-full my-5">
            <Button
              className="w-full sm:w-unset mr-auto my-4"
              type="primary"
              htmlType="submit"
              loading={updateAlertQuestion.isLoading}
              icon={<SaveOutlined />}>
              {t('save')}
            </Button>
          </Row>
        </Form>
      </Card>
    </Row>
  );
};

export default QuestionInfo;
