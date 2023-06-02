import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Form, Input, Row, Col, Checkbox, Radio, InputNumber, Button} from 'antd';
import {
  CustomUpload,
  DrillDownSelectPaginate,
  MultiSelect,
  MultiSelectPaginate,
  SimpleSelect,
  TagSelect
} from 'components';
import {useFetch, usePost} from 'hooks';
import {Complexities} from 'assets';
import map from 'lodash/map';
import {SaveOutlined} from '@ant-design/icons';

interface Props {
  id?: string;
}

const ProfessionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');

  const [form] = Form.useForm();

  const fetchProfession = useFetch({
    url: 'users/{id}/profession',
    name: ['user', id, 'profession'],
    params: {id},
    enabled: true
  });

  const updateProfession = usePost({
    url: 'users/{id}/profession',
    method: 'POST',
    removeQueries: [['user', id, 'profession']],
    form
  });

  const onFinish = (value: any) => {
    value.categories_id = map(value.categories_id, 'id');
    value.specializations_id = map(value.specializations_id, 'id');
    value.diseases_id = map(value.diseases_id, 'id');
    value.certificates = map(value.certificates, 'path');

    updateProfession.post(value, {}, {id});
  };

  return (
    <Form
      layout="vertical"
      requiredMark={false}
      form={form}
      className=" w-full"
      name="ProfessionalInfo"
      onFinish={onFinish}>
      <Card
        title={t('profession_info.label')}
        loading={(id && !fetchProfession?.data) || fetchProfession.isFetching}
        className="w-full">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('profession_info.nickname')}
              name="nickName"
              initialValue={fetchProfession?.data?.nickname}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="categories_id"
              label={t('profession_info.medicine_category')}
              initialValue={fetchProfession?.data?.categories}>
              <MultiSelect
                mode="multiple"
                url="categories"
                urlName="categories"
                keyValue="id"
                keyLabel="name"
                disabled={!fetchProfession?.data?.permissions?.categories}
                placeholder={t('profession_info.category')}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="medical_council_code"
              label={t('profession_info.medical_system_number')}
              initialValue={fetchProfession?.data?.medical_council_code}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="specializations_id"
              label={t('profession_info.specialty')}
              className="w-full"
              initialValue={fetchProfession?.data?.specializations}>
              <MultiSelectPaginate
                mode="multiple"
                keyValue="id"
                keyLabel="name"
                url="specializations/paginate"
                urlName="specializations"
                disabled={!fetchProfession?.data?.permissions?.specializations}
                placeholder={t('profession_info.specialization')}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="diseases_id"
              label={t('profession_info.care_scheme')}
              initialValue={fetchProfession?.data?.diseases}>
              <DrillDownSelectPaginate
                url="diseases/children"
                urlName="diseases"
                keyLabel="name"
                keyValue="id"
                title={t('profession_info.diseases')}
                mode="multiple"
                disabled={!fetchProfession?.data?.permissions?.diseases}
                placeholder={t('profession_info.disease')}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item valuePropName="checked" name="is_providing" initialValue={fetchProfession?.data?.is_providing}>
              <Checkbox disabled={!fetchProfession?.data?.permissions?.is_providing}>
                {t('profession_info.providing')}
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item valuePropName="checked" name="approve" initialValue={fetchProfession?.data?.approve}>
              <Checkbox disabled={!fetchProfession?.data?.permissions?.approve}>
                {t('profession_info.approve')}
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              valuePropName="checked"
              name="new_patient_visit"
              initialValue={fetchProfession?.data?.new_patient_visit}>
              <Checkbox disabled={!fetchProfession?.data?.permissions?.approve}>
                {t('profession_info.new_patient_visit')}
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="extra_clinics"
              label={t('profession_info.extra_clinics')}
              initialValue={fetchProfession?.data?.extra_clinics}>
              <TagSelect
                className="w-full"
                disabled={!fetchProfession?.data?.permissions?.extra_clinics}
                placeholder={t('profession_info.empty')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        title={t('profession_info.filter')}
        loading={(id && !fetchProfession?.data) || fetchProfession.isFetching}
        className="my-2 w-full">
        <Row gutter={[16, 8]} className="w-full my-2">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['filter', 'gender']}
              label={t('account_info.sex')}
              className="text-center"
              initialValue={fetchProfession?.data?.filter?.gender || 'all'}>
              <Radio.Group disabled={!fetchProfession?.data?.permissions?.filters}>
                <Radio value="male">{t('account_info.male')}</Radio>
                <Radio value="female">{t('account_info.female')}</Radio>
                <Radio value="all">{t('profession_info.all')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('profession_info.weight_range')}>
              <Input.Group className="w-full" compact>
                <Form.Item
                  name={['filter', 'weight_range', 'min']}
                  noStyle
                  initialValue={fetchProfession?.data?.filter?.weight_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: (rule, value) => {
                        if (value < form.getFieldValue('filter')?.weight_range?.max) {
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
                    disabled={!fetchProfession?.data?.permissions?.filters}
                    min={0}
                    max={200}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={['filter', 'weight_range', 'max']}
                  noStyle
                  initialValue={fetchProfession?.data?.filter?.weight_range?.max || 200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value < form.getFieldValue('filter')?.weight_range?.min) {
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
                    disabled={!fetchProfession?.data?.permissions?.filters}
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
                  name={['filter', 'age_range', 'min']}
                  noStyle
                  initialValue={fetchProfession?.data?.filter?.age_range?.min || 0}
                  rules={[
                    {required: true, message: 'کمترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value > form.getFieldValue('filter')?.age_range?.max) {
                          return Promise.reject('کمترین مقدار باید از بیشترین مقدار کوچکتر باشد');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.from')}
                    disabled={!fetchProfession?.data?.permissions?.filters}
                    minLength={1}
                    min={0}
                    max={1200}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={['filter', 'age_range', 'max']}
                  noStyle
                  initialValue={fetchProfession?.data?.filter?.age_range?.max || 1200}
                  rules={[
                    {required: true, message: 'بیشترین مقدار نمیتواند خالی باشد'},
                    {pattern: /^[0-9]*$/, message: 'باید عدد باشد'},
                    {
                      validator: async (rule, value) => {
                        if (value < form.getFieldValue('filter')?.age_range?.min) {
                          return Promise.reject('بیشترین مقدار باید از کمترین مقدار بزرگتر باشد');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <InputNumber
                    className="w-half"
                    placeholder={t('profession_info.to')}
                    disabled={!fetchProfession?.data?.permissions?.filters}
                    minLength={1}
                    min={0}
                    max={1200}
                    maxLength={4}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name={['filter', 'complexity']}
              label={t('profession_info.complixity')}
              initialValue={fetchProfession?.data?.filter?.complexity || 'all'}
              rules={[{required: true, message: t('messages.required')}]}>
              <SimpleSelect
                disabled={!fetchProfession?.data?.permissions?.filters}
                keys="id"
                label="name"
                data={Complexities}
                alignDropDownTop
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        title={t('profession_info.certificates')}
        loading={(id && !fetchProfession?.data) || fetchProfession.isFetching}
        className="w-full">
        <Row gutter={[16, 8]} className="w-full my-2">
          <Col span={24}>
            <Form.Item name="certificates" noStyle initialValue={fetchProfession?.data?.certificates}>
              <CustomUpload type="visits" mode="multiple" typeFile="image" name="image" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateProfession.isLoading}
            icon={<SaveOutlined />}>
            {t('profession_info.save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default ProfessionInfo;
