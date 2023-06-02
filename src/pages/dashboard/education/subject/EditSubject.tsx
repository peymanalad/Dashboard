import React, {useState} from 'react';
import {Button, Card, Col, Form, Row} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {language} from 'types/general';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {LanguageInput, MultiSelect} from 'components';

const EditSubject = () => {
  const {t} = useTranslation('subject');
  const {id} = useParams<{id?: string}>();
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchSubject = useFetch({
    name: ['subject', id],
    url: 'subjects/{id}',
    params: {id},
    enabled: !!id
  });

  const fetchLanguage = useFetch({
    url: '/languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const storeSubject = usePost({
    url: '/subjects',
    method: 'POST',
    removeQueries: ['subjects'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/subject/list'));
    }
  });

  const updateSubject = usePost({
    url: 'subjects/{id}',
    method: 'PATCH',
    removeQueries: ['subjects', ['subject', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/subject/list'));
    }
  });

  const onFinish = (values: any) => {
    values.languages = FlatLanguageData(values?.languages);
    id ? updateSubject.post(values, {}, {id}) : storeSubject.post(values);
  };

  return (
    <Form form={form} layout="vertical" name="subject" requiredMark={false} onFinish={onFinish}>
      <Card
        title={t('subject')}
        bordered={false}
        loading={fetchSubject.isFetching || fetchLanguage.isFetching}
        className="w-full"
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
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguage?.data}
              data={fetchSubject?.data}
              keyProp="title"
              language={language}
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={updateSubject.isLoading || storeSubject.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default EditSubject;
