import React, {useState} from 'react';
import {Card, Row, Col, Form, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {LanguageInput, DrillDownSelectPaginate, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import mapLodash from 'lodash/map';

const EditSpecializations = () => {
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('specializations');
  const isEn = isEnLocale();

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

  const fetchSpecialization = useFetch({
    url: 'specializations/{id}',
    name: ['specialization', id],
    params: {id},
    enabled: !!id
  });

  const updateSpecializations = usePost({
    url: 'specializations/{id}',
    method: 'PATCH',
    removeQueries: ['specializations', ['specialization', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/user/specialization/list'));
    }
  });

  const createSpecializations = usePost({
    url: 'specializations',
    method: 'POST',
    removeQueries: ['specializations'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/user/specialization/list'));
    }
  });

  const Submit = (values: any) => {
    values.diseases_id = mapLodash(values?.diseases_id, 'id');
    values.languages = FlatLanguageData(values?.languages);
    id ? updateSpecializations.post(values, {}, {id}) : createSpecializations.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('title')}
      loading={fetchSpecialization.isFetching || fetchLanguages.isFetching}
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
      <Form form={form} name="specialization" requiredMark={false} layout="vertical" onFinish={Submit}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchSpecialization?.data}
              keyProp="name"
              language={language}
            />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item name="diseases_id" label={t('disease')} initialValue={fetchSpecialization?.data?.diseases}>
              <DrillDownSelectPaginate
                title={t('diseases')}
                mode="multiple"
                notSelectParent={false}
                notSelectChild={false}
                url="diseases/children"
                urlName="diseases"
                isGeneral
                keyValue="id"
                keyLabel="name"
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createSpecializations.isLoading || updateSpecializations.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditSpecializations;
