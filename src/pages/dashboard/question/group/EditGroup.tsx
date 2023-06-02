import React, {useState} from 'react';
import {Card, Row, Form, Col, Button} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {MultiSelectPaginate, LanguageInput, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';

const EditQuestionGroup = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('question');
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchLanguages = useFetch({
    url: 'languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const fetchQuestionGroup = useFetch({
    url: '/question_groups/{id}',
    params: {id},
    name: ['questionGroup', id],
    enabled: !!id
  });

  const updateQuestionGroup = usePost({
    url: '/question_groups/{id}',
    method: 'PATCH',
    removeQueries: ['questionGroups'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/question/group/list'));
    }
  });

  const createQuestionGroup = usePost({
    url: 'question_groups',
    method: 'POST',
    removeQueries: ['questionGroups', ['questionGroup', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/question/group/list'));
    }
  });

  const onFinish = (values: any) => {
    values.parent_id = values.parent_id?.id;
    values.languages = FlatLanguageData(values?.languages);
    id ? updateQuestionGroup.post(values) : createQuestionGroup.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('add_question_groups')}
      loading={fetchQuestionGroup?.isFetching || fetchLanguages?.isFetching}
      extra={
        <MultiSelect
          url="languages"
          urlName="languages"
          keyValue="id"
          keyLabel="name"
          value={language}
          onChange={setLanguage}
          isGeneral
        />
      }>
      <Form form={form} name="QuestionGroup" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchQuestionGroup?.data}
              keyProp="title"
              language={language}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('parent')}
              name="parent_id"
              rules={[
                {
                  validator: async (rule, value) => {
                    if (id && value == id) {
                      return Promise.reject(t('messages.sameParentGroup'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              initialValue={fetchQuestionGroup?.data?.parent}>
              <MultiSelectPaginate
                url="question_groups/paginate"
                keyValue="id"
                keyLabel="title"
                searchKey="title"
                placeholder={t('empty')}
                className="ant-select-rtl"
                urlName="question_groups"
                isGeneral={false}
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              required={false}
              textArea
              languages={fetchLanguages?.data}
              data={fetchQuestionGroup?.data}
              keyProp="description"
              language={language}
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateQuestionGroup.isLoading || createQuestionGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditQuestionGroup;
