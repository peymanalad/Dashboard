import React, {FC, useState} from 'react';
import {Card, Row, Form, Input, Col, Button} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {LanguageInput, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';

const EditTimes: FC = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('prescription');
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchTimes = useFetch({
    url: 'prescription_times/{id}',
    params: {id},
    name: ['prescriptionTime', id],
    enabled: !!id
  });

  const fetchLanguage = useFetch({
    url: '/languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const updateTimes = usePost({
    url: 'prescription_times/{id}',
    method: 'PATCH',
    removeQueries: ['prescriptionTimes', ['prescriptionTime', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/times/list'));
    }
  });

  const createTimes = usePost({
    url: 'prescription_times',
    method: 'POST',
    removeQueries: ['prescriptionTimes'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/times/list'));
    }
  });

  const onFinish = (values: any) => {
    values.code = 1;
    values.languages = FlatLanguageData(values?.languages);
    id ? updateTimes.post(values, {}, {id}) : createTimes.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('title')}
      bordered={false}
      loading={fetchTimes.isFetching}
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
      <Form form={form} name="prescriptionTimes" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput languages={fetchLanguage?.data} data={fetchTimes?.data} keyProp="name" language={language} />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name={['data', 'step']} label={t('how_many_every_days')} initialValue={fetchTimes?.data?.step}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name={['data', 'value']} label={t('how_many_in_day')} initialValue={fetchTimes?.data?.value}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createTimes.isLoading || updateTimes.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditTimes;
