import React, {useState} from 'react';
import {Card, Row, Form, Col, Button, InputNumber, Input, Checkbox, Radio} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import isUndefined from 'lodash/isUndefined';
import {
  CustomUpload,
  MultiSelectPaginate,
  SimpleSelect,
  LanguageInput,
  MultiSelect,
  DrillDownSelectPaginate
} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {EditOption} from 'containers';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';
import {QuestionType, QuestionAbleTypeStatus, season, QuestionChartType} from 'assets';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import {optionsTypeProps} from 'types/question';

const EditQuestion = () => {
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

  const fetchQuestion = useFetch({
    url: '/questions/{id}',
    name: ['question', id],
    params: {id},
    enabled: !!id
  });

  const updateQuestion = usePost({
    url: '/questions/{id}',
    method: 'PATCH',
    removeQueries: ['questions', ['question', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/question/question/list'));
    }
  });

  const createQuestion = usePost({
    url: 'questions',
    method: 'POST',
    removeQueries: ['questions'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/question/question/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = values?.picture?.path || null;
    values.source_id = values?.source_id?.id;
    values.disease_id = values?.disease_id?.id;
    values.is_active = values?.is_active ? 1 : 0;
    values.group_id = values?.group_id?.id;
    values.disease_groups_id = map(values?.disease_groups_id, 'id');

    if (values?.type === 'one_select' || values?.type === 'multi_select') {
      values.options = values.options?.map((option: optionsTypeProps, index: number) => {
        const maxId =
          values.options.reduce(
            (max: number, option: optionsTypeProps) => (option?.id > max ? option?.id : max),
            values.options[0]?.id
          ) || index;
        return {
          ...option,
          id: option?.id || maxId + 1
        };
      });

      values.validations = {
        ...values?.validations,
        alert: map(values.options, (option: optionsTypeProps) => ({id: option.id, text: option?.alert}))
      };

      map(values.options, ['id', 'name', 'value']);
    } else values.options = undefined;

    values.filters = {
      ...values.filters,
      times: values?.filters?.times || null
    };
    values.languages = FlatLanguageData(values?.languages);
    id ? updateQuestion.post(values, {}, {id}) : createQuestion.post(values);
  };

  return (
    <Form
      name="QuestionsForm"
      form={form}
      scrollToFirstError
      requiredMark={false}
      layout="vertical"
      onFinish={onFinish}>
      <Card
        title={t('add_question')}
        loading={(id && !fetchQuestion?.data) || fetchQuestion.isFetching || fetchLanguages.isFetching}
        bordered={false}
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
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}} dir={language?.direction}>
            <LanguageInput
              languages={fetchLanguages?.data}
              data={fetchQuestion?.data}
              keyProp="title"
              language={language}
            />
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
            <Form.Item
              label={t('group')}
              name="group_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchQuestion?.data?.group}>
              <MultiSelectPaginate
                url="question_groups/paginate"
                keyValue="id"
                keyLabel="title"
                searchKey="title"
                placeholder={t('empty')}
                urlName="question_groups"
                isGeneral={false}
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
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
                fetchQuestion?.data?.picture_url && {
                  path: fetchQuestion?.data?.picture,
                  url: fetchQuestion?.data?.picture_url
                }
              }>
              <CustomUpload type="recommendations" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item
              name="priority"
              label={t('question_priority')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchQuestion?.data?.priority || 0}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item
              name="step"
              label={t('step')}
              className="w-full"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchQuestion?.data?.step || 0}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="gap" label={t('gap')} className="w-full" initialValue={fetchQuestion?.data?.gap}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="expire" label={t('expire')} className="w-full" initialValue={fetchQuestion?.data?.expire}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} className="flex align-center justify-center">
            <Form.Item
              name="is_active"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchQuestion?.data?.is_active === 1}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4} className="flex align-center justify-center">
            <Form.Item
              name={['validations', 'required']}
              valuePropName="checked"
              className="m-0"
              initialValue={
                !isNil(fetchQuestion?.data?.validations?.required) ? fetchQuestion?.data?.validations?.required : false
              }>
              <Checkbox>{t('required_answer')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item label={t('source')} name="source_id" initialValue={fetchQuestion?.data?.source}>
              <MultiSelectPaginate
                url="sources/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="sources"
                isGeneral={false}
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              label={t('type_question')}
              name="type"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchQuestion?.data?.type}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={QuestionType?.map((value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              label={t('type_chart')}
              name="chart_type"
              normalize={(value: any) => {
                if (isUndefined(value)) return null;
                return value;
              }}
              initialValue={fetchQuestion?.data?.chart_type}>
              <SimpleSelect keys="id" label="name" data={QuestionChartType} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="disease_id"
              label={t('care')}
              className="w-full"
              initialValue={fetchQuestion?.data?.disease}>
              <DrillDownSelectPaginate
                url="diseases/children"
                urlName="Diseases"
                mode="single"
                keyLabel="name"
                keyValue="id"
                title={t('care')}
                placeholder={t('all')}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.type !== nextValues?.type}>
            {() =>
              (form.getFieldValue('type') === 'one_select_custom' ||
                form.getFieldValue('type') === 'multi_select_custom') && (
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name="questionable_type"
                    label={t('questionable_type')}
                    initialValue={fetchQuestion?.data?.questionable_type}>
                    <SimpleSelect
                      keys="name"
                      label="name_fa"
                      data={QuestionAbleTypeStatus?.map((value) => ({...value, name_fa: t(value?.name)}))}
                    />
                  </Form.Item>
                </Col>
              )
            }
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, nextValues) =>
              prevValues?.questionable_type !== nextValues?.questionable_type || prevValues?.type !== nextValues?.type
            }>
            {() =>
              form.getFieldValue('questionable_type') === 'diseases' &&
              (form.getFieldValue('type') === 'one_select_custom' ||
                form.getFieldValue('type') === 'multi_select_custom') && (
                <Col xs={24} lg={16}>
                  <Form.Item
                    name="disease_groups_id"
                    label={t('care_group')}
                    initialValue={fetchQuestion?.data?.disease_groups}>
                    <MultiSelectPaginate
                      mode="multiple"
                      url="diseases/paginate"
                      params={{is_parent: 1}}
                      keyValue="id"
                      keyLabel="name"
                      placeholder={t('empty')}
                      treeSelect
                      showSearch
                      urlName="diseasesParent"
                      isGeneral
                      dropDownWith
                    />
                  </Form.Item>
                </Col>
              )
            }
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.type !== nextValues?.type}>
            {() =>
              form.getFieldValue('type') === 'number' && (
                <>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={['validations', 'len_range', 'min']}
                      label={t('len_rang_min')}
                      initialValue={fetchQuestion?.data?.validations?.len_range?.min}>
                      <InputNumber defaultValue={fetchQuestion?.data?.validations?.len_range?.min} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={['validations', 'len_range', 'max']}
                      label={t('len_rang_max')}
                      initialValue={fetchQuestion?.data?.validations?.len_range?.max}>
                      <InputNumber defaultValue={fetchQuestion?.data?.validations?.len_range?.max} className="w-full" />
                    </Form.Item>
                  </Col>
                </>
              )
            }
          </Form.Item>
        </Row>
        <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.type !== nextValues?.type}>
          {() => {
            if (form.getFieldValue('type') === 'number')
              return (
                <Row gutter={[16, 8]} className="w-full">
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={['validations', 'alert', 'min', 'value']}
                      label={t('alert_min_value')}
                      initialValue={fetchQuestion?.data?.validations?.alert?.min?.value}>
                      <InputNumber className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={16}>
                    <Form.Item
                      name={['validations', 'alert', 'min', 'text']}
                      label={t('alert_min_text')}
                      initialValue={fetchQuestion?.data?.validations?.alert?.min?.text}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={['validations', 'alert', 'max', 'value']}
                      label={t('alert_max_value')}
                      initialValue={fetchQuestion?.data?.validations?.alert?.max?.value}>
                      <InputNumber className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={16}>
                    <Form.Item
                      name={['validations', 'alert', 'max', 'text']}
                      label={t('alert_min_text')}
                      initialValue={fetchQuestion?.data?.validations?.alert?.max?.text}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              );
            if (form.getFieldValue('type') === 'one_select' || form.getFieldValue('type') === 'multi_select')
              return (
                <EditOption
                  options={fetchQuestion?.data?.options}
                  alerts={fetchQuestion?.data?.validations?.alert?.options}
                />
              );
          }}
        </Form.Item>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col span={24} dir={language?.direction}>
            <LanguageInput
              required={false}
              textArea
              languages={fetchLanguages?.data}
              data={fetchQuestion?.data}
              keyProp="description"
              language={language}
            />
          </Col>
        </Row>
      </Card>
      <Card
        title={t('filter')}
        loading={(id && !fetchQuestion?.data) || fetchQuestion.isFetching || fetchLanguages.isFetching}
        bordered={false}
        className="w-full my-4">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item
              label={t('gender')}
              name={['filters', 'gender']}
              initialValue={fetchQuestion?.data?.filters?.gender || 'all'}>
              <Radio.Group className="flex">
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
              initialValue={fetchQuestion?.data?.filters?.seasons || ['all']}>
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
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item
              label={t('marital_status')}
              name={['filters', 'marital_status']}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchQuestion?.data?.filters?.marital_status || 'all'}>
              <Radio.Group className="flex">
                <Radio value="single">{t('single')}</Radio>
                <Radio value="married">{t('married')}</Radio>
                <Radio value="all">{t('all')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('question_period')}
              name={['filters', 'times']}
              initialValue={fetchQuestion?.data?.filters?.times}>
              <InputNumber minLength={1} min={0} className="w-full" placeholder={t('profession_info.every')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('profession_info.weight_range')}>
              <Input.Group className="w-full" compact>
                <Form.Item
                  name={['filters', 'weight_range', 'min']}
                  noStyle
                  initialValue={fetchQuestion?.data?.filters?.weight_range?.min || 0}
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
                  initialValue={fetchQuestion?.data?.filters?.weight_range?.max || 200}
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
                  initialValue={fetchQuestion?.data?.filters?.age_range?.min || 0}
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
                  initialValue={fetchQuestion?.data?.filters?.age_range?.max || 1200}
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
        <Row gutter={[16, 8]} className="w-full flex justify-end align-center">
          <Button
            className="my-5 self-end"
            type="primary"
            htmlType="submit"
            loading={updateQuestion.isLoading || createQuestion.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default EditQuestion;
