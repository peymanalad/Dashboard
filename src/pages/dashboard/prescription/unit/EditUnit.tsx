import React, {FC, useState} from 'react';
import {Card, Row, Form, Col, Button} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {LanguageInput, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';

const EditUnit: FC = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('prescription');
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchUnit = useFetch({
    url: 'units/{id}',
    name: ['unit', id],
    params: {id},
    enabled: !!id
  });

  const fetchLanguage = useFetch({
    url: 'languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const updateUnit = usePost({
    url: 'units/{id}',
    method: 'PATCH',
    removeQueries: ['units', ['unit', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/unit/list'));
    }
  });

  const createUnit = usePost({
    url: 'units',
    method: 'POST',
    removeQueries: ['units'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/unit/list'));
    }
  });

  const onFinish = (values: any) => {
    values.code = 1;
    values.languages = FlatLanguageData(values?.languages);
    id ? updateUnit.post(values, {}, {id}) : createUnit.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('title')}
      loading={(id && !fetchUnit?.data) || fetchUnit.isFetching || fetchLanguage.isFetching}
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
      <Form form={form} name="specialization" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput languages={fetchLanguage?.data} data={fetchUnit?.data} keyProp="name" language={language} />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createUnit.isLoading || updateUnit.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditUnit;
