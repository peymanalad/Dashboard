import React, {useState} from 'react';
import {Card, Row, Form, Col, Button, InputNumber, Divider} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {CustomUpload, SimpleSelect, LanguageInput, MultiSelect} from 'components';
import {getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';
import {nutritionalState, nutritionalStatus, nutritionalMeta} from 'assets';

const EditNutritional = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('nutritional');
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchNutritional = useFetch({
    url: '/nutritional_values/{id}',
    name: ['nutritional_value', id],
    params: {id},
    enabled: !!id
  });

  const fetchLanguage = useFetch({
    url: '/languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const updateNutritional = usePost({
    url: '/nutritional_values/{id}',
    method: 'PATCH',
    removeQueries: ['nutritional_values', ['nutritional_value', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/nutritional/list'));
    }
  });

  const createNutritional = usePost({
    url: 'nutritional_values',
    method: 'POST',
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/nutritional/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path;
    id ? updateNutritional.post(values) : createNutritional.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('nutritional_value')}
      loading={fetchNutritional.isFetching || fetchLanguage.isFetching || !fetchNutritional.data}
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
      <Form form={form} name="nutritional" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguage?.data}
              data={fetchNutritional?.data}
              keyProp="name"
              language={language}
            />
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguage?.data}
              data={fetchNutritional?.data}
              keyProp="size"
              language={language}
            />
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
                fetchNutritional?.data?.picture_url && {
                  path: fetchNutritional?.data?.picture,
                  url: fetchNutritional?.data?.picture_url
                }
              }>
              <CustomUpload type="recommendations" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item name="is_active" label={t('status')} initialValue={fetchNutritional?.data?.is_active}>
              <SimpleSelect keys="id" label="name" data={nutritionalStatus} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="state_of_matter"
              label={t('state.title')}
              initialValue={fetchNutritional?.data?.state_of_matter}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={nutritionalState?.map((value) => ({...value, name_fa: t(`state.${value?.name}`)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name="weight" label={t('weight')} initialValue={fetchNutritional?.data?.weight}>
              <InputNumber defaultValue={fetchNutritional?.data?.weight} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name="size_weight" label={t('size_weight')} initialValue={fetchNutritional?.data?.size_weight}>
              <InputNumber defaultValue={fetchNutritional?.data?.size_weight} className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="right">{t('meta')}</Divider>
        <Row gutter={[16, 8]} className="w-full">
          {nutritionalMeta?.map((meta) => (
            <Col xs={12} sm={8} md={6} lg={3} key={meta.name}>
              <Form.Item
                name={['meta', meta.name]}
                label={meta.name}
                initialValue={fetchNutritional?.data?.meta[meta.name]}>
                <InputNumber defaultValue={fetchNutritional?.data?.meta[meta.name]} className="w-full" />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateNutritional.isLoading || createNutritional.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditNutritional;
