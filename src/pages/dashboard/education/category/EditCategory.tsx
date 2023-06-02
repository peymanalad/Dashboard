import React, {useState} from 'react';
import {Button, Card, Col, Form, Row} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {language} from 'types/general';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {LanguageInput, MultiSelect} from 'components';

const EditReference = () => {
  const {t} = useTranslation('category');
  const {id} = useParams<{id?: string}>();
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchCategory = useFetch({
    name: ['category', id],
    url: 'categories/{id}',
    params: {id},
    enabled: true
  });

  const fetchLanguage = useFetch({
    url: '/languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const createCategory = usePost({
    url: '/categories',
    method: 'POST',
    removeQueries: ['categories', ['category', id]],
    form,
    isGeneral: false,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/category/list'));
    }
  });

  const updateCategory = usePost({
    url: 'categories/{id}',
    method: 'PATCH',
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/category/list'));
    }
  });

  const onFinish = (values: any) => {
    values.languages = FlatLanguageData(values?.languages);
    id ? updateCategory.post(values, {}, {id}) : createCategory.post(values);
  };

  return (
    <Form form={form} layout="vertical" name="category" requiredMark={false} onFinish={onFinish}>
      <Card
        title={t('category')}
        bordered={false}
        loading={fetchCategory?.isFetching || fetchLanguage?.isFetching}
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
              data={fetchCategory?.data}
              keyProp="name"
              language={language}
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguage?.data}
              data={fetchCategory?.data}
              keyProp="description"
              language={language}
              textArea
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={createCategory.isLoading || updateCategory.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default EditReference;
