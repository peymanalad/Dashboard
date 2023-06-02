import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Form, Input, Row, Col, Card, Button, Checkbox, Space} from 'antd';
import {MessageOutlined, SaveOutlined, EyeOutlined} from '@ant-design/icons';
import {usePost, useFetch} from 'hooks';
import {useTranslation} from 'react-i18next';
import {DateTimePicker, MultiSelectPaginate} from 'components';

interface Props {
  id?: string;
}

const BasicInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');
  const [form] = Form.useForm();

  const fetchVisit = useFetch({
    name: ['visit', 'basic', id],
    url: 'visits/{id}',
    params: {id},
    enabled: true
  });

  const updateVisit = usePost({
    url: 'visits/{id}',
    method: 'PATCH',
    removeQueries: [['visit', 'basic', id]],
    form
  });

  const save = (value: any) => {
    value.status = value?.status ? 'active' : 'inactive';
    value.group_id = value?.group_id?.id;
    value.doctor_id = value?.doctor_id?.id;
    value.clinic_id = value?.clinic_id?.id;

    updateVisit.post(value, {}, {id});
  };

  return (
    <Card
      title={t(id ? 'edit_file.title' : 'create.title')}
      loading={fetchVisit.isFetching || !fetchVisit.data}
      bordered={false}
      extra={
        <Space size="small">
          <Link to={`/user/edit/${fetchVisit?.data?.user?.id}`}>
            <Button
              type="primary"
              className="ant-btn-warning not-show-factor d-text-none md:d-text-unset"
              icon={<EyeOutlined />}>
              {t('show_user')}
            </Button>
          </Link>
          <Link to={`/message/support/chat/${fetchVisit?.data?.user?.id}`}>
            <Button type="primary" className="ant-btn-success d-text-none md:d-text-unset" icon={<MessageOutlined />}>
              {t('supportMessage')}
            </Button>
          </Link>
        </Space>
      }
      className="w-full">
      <Form form={form} layout="vertical" name="visit" scrollToFirstError requiredMark={false} onFinish={save}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="patientName"
              initialValue={fetchVisit?.data?.user?.full_name || fetchVisit?.data?.user?.username || ''}
              label={t('create.username')}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item initialValue={fetchVisit?.data?.id} name="visitID" label={t('create.appointment_number')}>
              <Input disabled placeholder={t('create.appointment_number_placeholder')} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="visited_at"
              initialValue={fetchVisit?.data?.visited_at}
              rules={[{required: true, message: t('validate.date_time')}]}
              label={t('create.date_time_next_venue')}>
              <DateTimePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="doctor_id" initialValue={fetchVisit?.data?.doctor} label={t('create.dr')}>
              <MultiSelectPaginate
                url="users/doctors"
                urlName="userDoctors"
                isGeneral
                keyValue="id"
                keyLabel="full_name"
                showSearch
                placeholder={t('choose')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues: any, nextValues: any) => {
                if (prevValues?.doctor_id?.id !== nextValues?.doctor_id?.id) {
                  form.setFieldsValue({
                    clinic_id: null
                  });
                  return true;
                }
                return false;
              }}>
              {(fields) => (
                <Form.Item name="clinic_id" label={t('create.care_center')} initialValue={fetchVisit?.data?.clinic}>
                  <MultiSelectPaginate
                    url="users/clinics"
                    urlName="users_clinics"
                    params={{doctor_id: fields.getFieldValue('doctor_id')?.id}}
                    keyLabel="name"
                    showSearch
                    keyValue="id"
                    isGeneral
                    placeholder={t('choose')}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="group_id"
              initialValue={fetchVisit?.data?.group}
              label={t('create.group')}
              validateStatus={fetchVisit?.data?.group_valid !== null && fetchVisit?.data ? 'error' : ''}
              help={fetchVisit?.data?.group_valid !== null && fetchVisit?.data ? t('validate.group') : ''}>
              <MultiSelectPaginate
                url="users/groups"
                urlName="userGroups"
                showValue
                keyValue="id"
                keyLabel="name"
                keyImage="avatar"
                hasImage
                allowClear
                isGeneral
                showSearch
                placeholder={t('choose')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} className="flex justify-center align-center">
            <Form.Item name="referral" valuePropName="checked" initialValue={fetchVisit?.data?.referral === 1}>
              <Checkbox style={{lineHeight: '32px'}}>{t('create.referral_from_dr')}</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} className="flex justify-center align-center">
            <Form.Item name="status" valuePropName="checked" initialValue={fetchVisit?.data?.status === 'active'}>
              <Checkbox style={{lineHeight: '32px'}}>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name={['data', 'complaint']}
              initialValue={fetchVisit?.data?.meta?.complaint || ''}
              label={t('create.complaint')}>
              <Input.TextArea placeholder={t('create.complaint_placeholder')} autoSize />
            </Form.Item>
            <Form.Item
              name={['data', 'history_of_present_illness']}
              initialValue={fetchVisit?.data?.meta?.history_of_present_illness || ''}
              label={t('create.history_of_present_illness')}>
              <Input.TextArea placeholder={t('create.history_of_present_illness_placeholder')} autoSize />
            </Form.Item>
            <Form.Item
              name={['data', 'appearance']}
              initialValue={fetchVisit?.data?.meta?.appearance || ''}
              label={t('create.appearance')}>
              <Input.TextArea placeholder={t('create.appearance')} autoSize />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={['data', 'symptoms']}
              initialValue={fetchVisit?.data?.meta?.symptoms || ''}
              label={t('create.symptoms')}>
              <Input.TextArea placeholder={t('create.symptoms_placeholder')} autoSize />
            </Form.Item>
            <Form.Item
              name={['data', 'current_drug']}
              initialValue={fetchVisit?.data?.meta?.current_drug || ''}
              label={t('create.current_drug')}>
              <Input.TextArea placeholder={t('create.current_drug_placeholder')} autoSize />
            </Form.Item>
            <Form.Item
              name={['data', 'paraclinic']}
              initialValue={fetchVisit?.data?.meta?.paraclinic || ''}
              label={t('create.paraclinic')}>
              <Input.TextArea placeholder={t('create.paraclinic')} autoSize />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateVisit.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default BasicInfo;
