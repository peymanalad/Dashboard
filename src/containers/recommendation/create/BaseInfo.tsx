import React, {FC, useState} from 'react';
import {Form, Row, Col, Card, Input, InputNumber, Tag, Radio} from 'antd';
import {DrillDownSelectPaginate, HorizontalSelect, MultiSelect, MultiSelectPaginate, SimpleSelect} from 'components';
import {levelSurface, season, defaultUser} from 'assets';
import {useTranslation} from 'react-i18next';
import {wordCounter} from 'utils';
import isNil from 'lodash/isNil';

interface props {
  fetchRecommendation: any;
  id: string;
  form: any;
}

const RecommendationBaseInfo: FC<props> = ({fetchRecommendation, id, form}) => {
  const {t} = useTranslation('recommendation');
  const {TextArea} = Input;

  const [descriptionPos, setDescriptionPos] = useState<number>(0);

  const setPosition = (e: any) => {
    setDescriptionPos(e.target.selectionStart);
  };

  const selectTag = (item: {name: string; id: number}) => {
    const addData = ` [${item.name}|${item.id}] `;
    const content = form.getFieldValue('content');
    form.setFieldsValue({
      content: content?.slice(0, descriptionPos) + addData + content?.slice(descriptionPos)
    });
  };

  return (
    <>
      <Card
        title={t('base_info')}
        loading={id && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data}
        bordered={false}
        className="w-full">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="title"
              label={t('title_field')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.title}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('rcmnd_another_lng')}
              name="other_languages"
              initialValue={fetchRecommendation?.data?.other_languages}>
              <MultiSelectPaginate
                mode="multiple"
                url="recommendations/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="Recommendations"
                searchKey="title"
                isGeneral={false}
                showSearch
                dropDownWith
                treeSelect
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="language"
              label={t('language')}
              initialValue={fetchRecommendation?.data?.language === 'en' ? {id: 0, name: 'en'} : {id: 1, name: 'fa'}}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelect url="languages" urlName="languages" keyValue="id" keyLabel="name" isGeneral showSearch />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} lg={8}>
            <Form.Item label={t('no_link_tags')} name="tags" initialValue={fetchRecommendation?.data?.tags}>
              <MultiSelectPaginate
                mode="multiple"
                url="tags/paginate"
                keyValue="id"
                keyLabel="name"
                placeholder={t('empty')}
                urlName="tags"
                isGeneral
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={16}>
            <Form.Item label={t('linkable_tags')} name="linkable_tags">
              <HorizontalSelect
                url="tags/paginate"
                params={{content: 1}}
                urlName="desTags"
                isGeneral
                selectTag={selectTag}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full" justify="end">
          <Col span={24}>
            <Form.Item
              name="content"
              label={t('full_description_rcmnd')}
              initialValue={fetchRecommendation?.data?.content}
              rules={[{required: true, message: t('messages.required')}]}>
              <TextArea rows={7} onChange={setPosition} onClick={setPosition} />
            </Form.Item>
          </Col>
          <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.content !== nextValues?.content}>
            {() => {
              const wordCount = wordCounter(form.getFieldValue('content'));
              return (
                <Tag color={wordCount > 300 ? 'magenta' : wordCount > 200 ? 'green' : 'geekblue'}>{wordCount}</Tag>
              );
            }}
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              name="warning"
              className="w-full"
              initialValue={fetchRecommendation?.data?.warning}
              label={t('warnings')}>
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('related_disease')}
              name="disease_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.disease}>
              <DrillDownSelectPaginate
                title={t('related_disease')}
                placeholder={t('empty')}
                mode="single"
                notSelectParent
                notSelectChild={false}
                url="diseases/children"
                urlName="diseases"
                isGeneral
                keyLabel="name"
                keyValue="id"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('and_another_disease')}
              name="and_disease"
              initialValue={fetchRecommendation?.data?.and_diseases}>
              <DrillDownSelectPaginate
                title={t('and_another_disease')}
                placeholder={t('empty')}
                mode="multiple"
                notSelectParent
                notSelectChild={false}
                url="diseases/children"
                urlName="diseases"
                isGeneral
                keyLabel="name"
                keyValue="id"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('except_disease')}
              name="exclude_disease"
              initialValue={fetchRecommendation?.data?.exclude_diseases}>
              <DrillDownSelectPaginate
                title={t('except_disease')}
                placeholder={t('empty')}
                mode="multiple"
                notSelectParent
                notSelectChild={false}
                url="diseases/children"
                urlName="diseases"
                isGeneral
                keyLabel="name"
                keyValue="id"
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('subjects')}
              name="subject_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.subject}>
              <MultiSelectPaginate
                url="subjects/paginate"
                keyValue="id"
                keyLabel="title"
                placeholder={t('empty')}
                urlName="subjects"
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('writer')}
              name="creator_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.creator || {id: 188, full_name: 'پزشک بهزی'}}>
              <MultiSelectPaginate
                url="users/doctors"
                placeholder={t('empty')}
                keyImage="avatar"
                hasImage
                defaultImage={defaultUser}
                keyValue="id"
                keyLabel="full_name"
                urlName="doctors"
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('researcher')}
              name="researcher_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.researcher}>
              <MultiSelectPaginate
                url="users/researchers"
                placeholder={t('empty')}
                keyValue="id"
                keyLabel="full_name"
                urlName="researchers"
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('type_medicine')}
              name="category_id"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.category}>
              <MultiSelect
                url="categories"
                keyValue="id"
                keyLabel="name"
                urlName="categories"
                placeholder={t('empty')}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('level_surface')}
              name="harm_level"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.harm_level || 2}>
              <SimpleSelect keys="id" label="name" placeholder={t('empty')} data={levelSurface} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('send_priority')}
              name="priority_send"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={
                !isNil(fetchRecommendation?.data?.priority_send) ? fetchRecommendation?.data?.priority_send : 2
              }>
              <InputNumber min={0} max={10} className="w-full" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        title={t('filters')}
        loading={id && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data}
        bordered={false}
        className="w-full my-4">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item
              name={['filters', 'gender']}
              label={t('gender')}
              className="text-center"
              initialValue={fetchRecommendation?.data?.filters?.gender || 'all'}>
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
              initialValue={fetchRecommendation?.data?.filters?.seasons || ['all']}>
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
              className="text-center"
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchRecommendation?.data?.filters?.marital_status || 'all'}>
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
                  initialValue={fetchRecommendation?.data?.filters?.weight_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: (rule, value) => {
                        if (
                          value &&
                          form.getFieldValue('filters')?.weight_range?.max &&
                          value > form.getFieldValue('filters')?.weight_range?.max
                        ) {
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
                    max={200}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={['filters', 'weight_range', 'max']}
                  noStyle
                  initialValue={fetchRecommendation?.data?.filters?.weight_range?.max || 200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (
                          value &&
                          form.getFieldValue('filters')?.weight_range?.min &&
                          value < form.getFieldValue('filters')?.weight_range?.min
                        ) {
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
                  initialValue={fetchRecommendation?.data?.filters?.age_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (
                          value &&
                          form.getFieldValue('filters')?.age_range?.max &&
                          value > form.getFieldValue('filters')?.age_range?.max
                        ) {
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
                  initialValue={fetchRecommendation?.data?.filters?.age_range?.max || 1200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (
                          value &&
                          form.getFieldValue('filters')?.age_range?.min &&
                          value < form.getFieldValue('filters')?.age_range?.min
                        ) {
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
      </Card>
      <Card
        title={t('title_rmi')}
        loading={id && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data}
        bordered={false}
        className="w-full my-4">
        <Row gutter={[16, 8]}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="bmi" label={t('profession_info.range_BMI')}>
              <Input.Group className="w-full" compact>
                <Form.Item
                  name={['bmi', 'min']}
                  noStyle
                  initialValue={fetchRecommendation?.data?.bmi?.min}
                  rules={[
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value && form.getFieldValue('bmi')?.max && value > form.getFieldValue('bmi')?.max) {
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
                    min={10}
                    max={60}
                    maxLength={2}
                  />
                </Form.Item>
                <Form.Item
                  name={['bmi', 'max']}
                  noStyle
                  initialValue={fetchRecommendation?.data?.bmi?.max}
                  rules={[
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value && form.getFieldValue('bmi')?.min && value < form.getFieldValue('bmi')?.min) {
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
                    min={10}
                    max={60}
                    maxLength={2}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} lg={16}>
            <Form.Item
              label={t('content')}
              name={['bmi', 'message']}
              initialValue={fetchRecommendation?.data?.bmi?.message || ''}>
              <TextArea placeholder={t('empty')} rows={1} style={{height: '16px'}} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default RecommendationBaseInfo;
