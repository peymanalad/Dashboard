import React, {FC, useState} from 'react';
import {Card, Row, Form, Col, Button, Input, InputNumber, Radio, Checkbox} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {CustomUpload, SimpleSelect, LanguageInput, DrillDownSelectPaginate, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import mapLodash from 'lodash/map';
import {SaveOutlined} from '@ant-design/icons';
import {type, season} from 'assets';

const EditCare: FC = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('care');
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

  const fetchDisease = useFetch({
    url: '/diseases/{id}',
    name: ['disease', id],
    params: {id},
    isGeneral: false,
    enabled: !!id
  });

  const updateDisease = usePost({
    url: '/diseases/{id}',
    method: 'PATCH',
    form,
    removeQueries: ['diseases', ['disease', id]],
    isGeneral: false,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/care/list'));
    }
  });

  const createDisease = usePost({
    url: 'diseases',
    method: 'POST',
    form,
    isGeneral: false,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/care/list'));
    }
  });

  const onFinish = (values: any) => {
    values.parent_id = values?.parent_id?.id || null;
    values.is_confirm = values?.is_confirm ? 1 : 0;
    values.co_disease = mapLodash(values?.co_disease, 'id');
    values.picture = values?.picture?.path;
    values.languages = FlatLanguageData(values?.languages);
    id ? updateDisease.post(values, {}, {id}) : createDisease.post(values);
  };

  return (
    <Form name="specialization" form={form} requiredMark={false} layout="vertical" onFinish={onFinish}>
      <Card
        className="my-6"
        title={t('title')}
        loading={(id && !fetchDisease?.data) || fetchDisease?.isFetching || fetchLanguages?.isFetching}
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
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchDisease?.data}
              keyProp="name"
              language={language}
            />
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 2}} lg={{span: 8, order: 2}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchDisease?.data}
              required={false}
              keyProp="synonym_name"
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
                fetchDisease?.data?.picture_url && {
                  path: fetchDisease?.data?.picture,
                  url: fetchDisease?.data?.picture_url
                }
              }>
              <CustomUpload type="recommendations" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={9} lg={8}>
            <Form.Item name="parent_id" label={t('parent_disease')} initialValue={fetchDisease?.data?.parent}>
              <DrillDownSelectPaginate
                title={t('diseases')}
                mode="single"
                url="diseases/children"
                urlName="diseases"
                keyLabel="name"
                keyValue="id"
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={15} lg={16}>
            <Form.Item
              name="co_disease"
              label={t('co_disease')}
              rules={[{required: false}]}
              initialValue={fetchDisease?.data?.co_diseases}>
              <DrillDownSelectPaginate
                title={t('co_disease')}
                mode="multiple"
                notSelectParent
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
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="type" label={t('type')} initialValue={fetchDisease?.data?.type}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={type?.map((value) => ({...value, name_fa: t(value?.name)}))}
                defaultValues={fetchDisease?.data?.type}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="icd" label={t('ICD')} initialValue={fetchDisease?.data?.icd || ''}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              name="is_confirm"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchDisease?.data?.is_confirm}>
              <Checkbox>{t('active.true')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchDisease?.data}
              keyProp="description"
              required={false}
              language={language}
            />
          </Col>
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              textArea
              languages={fetchLanguages?.data}
              data={fetchDisease?.data}
              keyProp="note"
              required={false}
              language={language}
            />
          </Col>
        </Row>
      </Card>
      <Card
        title={t('filter')}
        loading={(id && !fetchDisease?.data) || fetchDisease?.isFetching || fetchLanguages?.isFetching}
        bordered={false}
        className="w-full my-4">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item
              label={t('gender')}
              name={['filters', 'gender']}
              className="text-center"
              initialValue={fetchDisease?.data?.filters?.gender || 'all'}>
              <Radio.Group>
                <Radio value="male">{t('male')}</Radio>
                <Radio value="female">{t('female')}</Radio>
                <Radio value="all">{t('all')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('season')}
              name={['filters', 'seasons']}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchDisease?.data?.filters?.seasons || ['all']}>
              <SimpleSelect
                keys="name"
                mode="multiple"
                label="name_fa"
                placeholder={t('empty')}
                hasAllOption
                data={season?.map((value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              label={t('marital_status')}
              name={['filters', 'marital_status']}
              className="text-center"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchDisease?.data?.filters?.marital_status || 'all'}>
              <Radio.Group>
                <Radio value="single">{t('single')}</Radio>
                <Radio value="married">{t('married')}</Radio>
                <Radio value="all">{t('all')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('profession_info.weight_range')}>
              <Input.Group className="w-full" compact>
                <Form.Item
                  name={['filters', 'weight_range', 'min']}
                  noStyle
                  initialValue={fetchDisease?.data?.filters?.weight_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: (rule, value) => {
                        if (value < form.getFieldValue('filters')?.weight_range?.max) {
                          return Promise.resolve();
                        }
                        return Promise.reject('کمترین مقدار باید از بیشترین مقدار کوچکتر باشد');
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.from')}
                    minLength={1}
                    min={0}
                    max={200}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={['filters', 'weight_range', 'max']}
                  noStyle
                  initialValue={fetchDisease?.data?.filters?.weight_range?.max || 200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value < form.getFieldValue('filters')?.weight_range?.min) {
                          return Promise.reject('بیشترین مقدار باید از کمترین مقدار بزرگتر باشد');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.to')}
                    minLength={1}
                    min={0}
                    max={200}
                    maxLength={3}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('profession_info.age_range')}>
              <Input.Group className="w-full" compact>
                <Form.Item
                  name={['filters', 'age_range', 'min']}
                  noStyle
                  initialValue={fetchDisease?.data?.filters?.age_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value > form.getFieldValue('filters')?.age_range?.max) {
                          return Promise.reject('کمترین مقدار باید از بیشترین مقدار کوچکتر باشد');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.from')}
                    minLength={1}
                    min={0}
                    max={1200}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={['filters', 'age_range', 'max']}
                  noStyle
                  initialValue={fetchDisease?.data?.filters?.age_range?.max || 1200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value < form.getFieldValue('filters')?.age_range?.min) {
                          return Promise.reject('بیشترین مقدار باید از کمترین مقدار بزرگتر باشد');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.to')}
                    minLength={1}
                    min={0}
                    max={1200}
                    maxLength={4}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={updateDisease?.isLoading || createDisease?.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default EditCare;
