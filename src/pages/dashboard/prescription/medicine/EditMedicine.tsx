import React, {useState} from 'react';
import {Card, Row, Form, Col, Button, Input} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {CustomUpload, LanguageInput, SimpleSelect, MultiSelectPaginate, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';
import {is_confirmService} from 'assets';
import map from 'lodash/map';

const EditMedicine = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('prescription');
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

  const fetchPrescription = useFetch({
    url: '/prescriptions/{id}',
    params: {id},
    name: ['prescription', id],
    enabled: !!id
  });

  const updatePrescription = usePost({
    url: '/prescriptions/{id}',
    method: 'PATCH',
    removeQueries: ['prescriptions', ['prescription', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/medicine/list'));
    }
  });

  const createPrescription = usePost({
    url: 'prescriptions',
    method: 'POST',
    removeQueries: ['prescriptions'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/prescription/medicine/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path;
    values.type_id = values?.type_id?.id;
    values.languages = FlatLanguageData(values?.languages);
    id ? updatePrescription.post(values, {}, {id}) : createPrescription.post(values);
  };

  return (
    <Card
      title={t('title')}
      bordered={false}
      loading={fetchPrescription.isFetching || fetchLanguages.isFetching}
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
      <Form form={form} name="specialization" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="name"
              language={language}
            />
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="groups"
              required={false}
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
                fetchPrescription?.data?.picture_url && {
                  path: fetchPrescription?.data?.picture,
                  url: fetchPrescription?.data?.picture_url
                }
              }>
              <CustomUpload type="diseases" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} order={4}>
            <Form.Item
              name="type_id"
              label={t('prescription_types')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchPrescription?.data?.type}>
              <MultiSelectPaginate
                url="prescription_types/paginate"
                keyValue="id"
                keyLabel="title"
                urlName="prescription_types"
                isGeneral
                showSearch
                dropDownWith={200}
                placeholder=""
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} order={4}>
            <Form.Item
              name="is_confirm"
              label={t('confirm.title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchPrescription?.data?.is_confirm}>
              <SimpleSelect
                keys="id"
                label="name_fa"
                data={map(is_confirmService, (value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} order={4}>
            <Form.Item name="ws_code" label={t('code')} initialValue={fetchPrescription?.data?.ws_code}>
              <Input disabled type="text" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="info"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="other_names"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="drug_interactions"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="usage"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="dosage"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="mechanism"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="forbidden"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="side_effect"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="drug_suggestion"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="use_in_pregnancy"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="pharmacokinetics"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="previous_considerations"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="next_considerations"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="classification"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchPrescription?.data}
              keyProp="warning"
              required={false}
              language={language}
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createPrescription.isLoading || updatePrescription.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditMedicine;
