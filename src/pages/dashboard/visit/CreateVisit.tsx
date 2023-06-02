import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {DateTimePicker, MultiSelectPaginate} from 'components';
import {useHistory, useLocation} from 'react-router-dom';
import {usePost} from 'hooks';
import {Form, Input, Row, Col, Card, Button, Checkbox} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {convertTimeToUTC, getLangSearchParam, queryStringToObject} from 'utils';

const CreateVisit: FC = () => {
  const {t} = useTranslation('visit');
  const history = useHistory();
  const [form] = Form.useForm();
  const queryObject = queryStringToObject(useLocation().search);

  const create = usePost({
    url: 'visits',
    method: 'POST',
    form,
    onSuccess(data: any): any {
      history.push(getLangSearchParam(`/visit/edit/${data?.id}`));
    }
  });

  const onFinish = (value: any) => {
    value.visited_at = convertTimeToUTC(value.visited_at);
    value.status = value.status ? 'active' : 'inactive';
    value.referral = value?.referral ? '1' : '0';
    value.clinic_id = value?.clinic_id?.id;
    value.doctor_id = value?.doctor_id?.id;
    value.group_id = value?.group_id?.id;
    value.user_id = queryObject?.user?.id;

    create.post(value);
  };

  return (
    <Card title={t('create.title')} bordered={false} className="w-full">
      <Form form={form} layout="vertical" name="visit" scrollToFirstError requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="patientName" initialValue={queryObject?.user?.full_name} label={t('create.username')}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) => prevValues?.doctor_id?.id !== nextValues?.doctor_id?.id}>
              {() => (
                <Form.Item
                  name="clinic_id"
                  label={t('create.care_center')}
                  rules={[{required: true, message: t('validate.clinic')}]}>
                  <MultiSelectPaginate
                    url="users/clinics"
                    keyValue="id"
                    keyLabel="name"
                    urlName="userClinic"
                    isGeneral
                    showSearch
                    onChange={(link: any) => form.setFieldsValue({clinic_id: link})}
                    params={{doctor_id: form.getFieldValue('doctor_id')?.id}}
                    allowClear={false}
                    dropDownWith
                    className="w-32"
                    placeholder={t('choose')}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="visited_at"
              rules={[{required: true, message: t('validate.date_time')}]}
              label={t('create.date_time_next_venue')}>
              <DateTimePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) => prevValues?.clinic_id?.id !== nextValues?.clinic_id?.id}>
              {() => (
                <Form.Item
                  name="doctor_id"
                  label={t('create.dr')}
                  rules={[{required: true, message: t('validate.dr')}]}>
                  <MultiSelectPaginate
                    url="users/doctors"
                    keyValue="id"
                    keyLabel="full_name"
                    urlName="userDoctors"
                    isGeneral
                    showSearch
                    onChange={(link: any) => form.setFieldsValue({doctor_id: link})}
                    params={{clinic_id: form.getFieldValue('clinic_id')?.id}}
                    allowClear={false}
                    dropDownWith
                    className="w-32"
                    placeholder={t('choose')}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item name="group_id" className="m-0" label={t('create.group')}>
              <MultiSelectPaginate
                url="users/groups"
                keyValue="id"
                keyLabel="name"
                keyImage="avatar"
                hasImage
                urlName="userGroups"
                isGeneral
                showSearch
                allowClear={false}
                dropDownWith
                className="w-32"
                placeholder={t('choose')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} className="flex justify-center align-center">
            <Form.Item name="referral" valuePropName="checked">
              <Checkbox style={{lineHeight: '32px'}}>{t('create.referral_from_dr')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} className="flex justify-center align-center">
            <Form.Item name="status" valuePropName="checked">
              <Checkbox style={{lineHeight: '32px'}}>{t('create.status')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item name={['data', 'complaint']} label={t('create.complaint')}>
              <Input.TextArea placeholder={t('create.complaint_placeholder')} autoSize />
            </Form.Item>
            <Form.Item name={['data', 'history_of_present_illness']} label={t('create.history_of_present_illness')}>
              <Input.TextArea placeholder={t('create.history_of_present_illness_placeholder')} autoSize />
            </Form.Item>
            <Form.Item name={['data', 'appearance']} label={t('create.appearance')}>
              <Input.TextArea placeholder={t('create.appearance')} autoSize />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name={['data', 'symptoms']} label={t('create.symptoms')}>
              <Input.TextArea placeholder={t('create.symptoms_placeholder')} autoSize />
            </Form.Item>
            <Form.Item name={['data', 'current_drug']} label={t('create.current_drug')}>
              <Input.TextArea placeholder={t('create.current_drug_placeholder')} autoSize />
            </Form.Item>
            <Form.Item name={['data', 'paraclinic']} label={t('create.paraclinic')}>
              <Input.TextArea placeholder={t('create.paraclinic')} autoSize />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={create.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateVisit;
