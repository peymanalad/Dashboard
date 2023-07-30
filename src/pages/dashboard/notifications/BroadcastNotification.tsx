/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react';
import {Card, Row, Form, Col, Button, notification, Input, Radio} from 'antd';
import {usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {DateTimePicker, MultiSelectPaginate, SimpleSelect} from 'components';
import {SaveOutlined} from '@ant-design/icons';
import {NotificationRoleType} from 'assets';
import map from 'lodash/map';

const EditQuestionGroup = () => {
  const {t} = useTranslation('message');

  const [form] = Form.useForm();

  const broadcastNotification = usePost({
    url: 'notifications/broadcast',
    method: 'POST',
    form,
    onSuccess: (data) => {
      notification.success({
        duration: 2,
        message: t('messages.broadcast', {count: data?.count})
      });
    }
  });

  const onFinish = (values: any) => {
    values.clinic_id = values?.clinic_id?.id;
    values.doctor_id = values?.doctor_id?.id;
    values.diseases_id = map(values?.diseases_id, 'id');
    values.users_id && (values.users_id = map(values.users_id, 'id'));
    broadcastNotification.post(values);
  };

  return (
    <Card className="my-6" title={t('broadcast_notification')}>
      <Form form={form} name="QuestionGroup" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('title')} name="title" rules={[{required: true, message: t('messages.required')}]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label={t('diseases')} name="diseases_id">
              <MultiSelectPaginate
                mode="multiple"
                url="diseases/paginate"
                keyValue="id"
                keyLabel="name"
                placeholder={t('empty')}
                urlName="diseases"
                isGeneral
                allowClear
                showSearch
                dropDownWith
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="role" label={t('role')} rules={[{required: true, message: t('messages.required')}]}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={NotificationRoleType?.map((value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.role !== nextValues?.role}>
            {() => (
              <>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label={t('clinic')} name="clinic_id">
                    <MultiSelectPaginate
                      disabled={form.getFieldValue('role') === 'doctor'}
                      url="users/clinics"
                      keyImage="avatar"
                      keyValue="id"
                      keyLabel="name"
                      placeholder={t('empty')}
                      urlName="clinics"
                      isGeneral
                      showSearch
                      dropDownWith
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label={t('doctor')} name="doctor_id">
                    <MultiSelectPaginate
                      disabled={form.getFieldValue('role') === 'doctor'}
                      url="/users/doctors"
                      keyImage="avatar"
                      keyValue="id"
                      keyLabel="full_name"
                      urlName="doctors"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label={t('user')} name="users_id">
                    <MultiSelectPaginate
                      mode="multiple"
                      disabled={!form.getFieldValue('role')}
                      url={`${form.getFieldValue('role') === 'doctor' ? '/users/doctors' : '/users/patients'}`}
                      keyImage="avatar"
                      keyValue="id"
                      keyLabel="full_name"
                      urlName={`${form.getFieldValue('role') === 'doctor' ? 'doctors' : 'patients'}`}
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Form.Item>

          <Col xs={24} md={12} lg={8}>
            <Form.Item name="expired_at" label={t('expired_at')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="user_created_from" label={t('user_created_from')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="user_created_to" label={t('user_created_to')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="birthday_from " label={t('birthday_from')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="birthday_to" label={t('birthday_to')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item name="gender" label={t('gender')} className="text-center">
              <Radio.Group>
                <Radio value="male">{t('male')}</Radio>
                <Radio value="female">{t('female')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex justify-center">
            <Form.Item label={t('marital_status')} name="marital_status" className="text-center">
              <Radio.Group>
                <Radio value="single">{t('single')}</Radio>
                <Radio value="married">{t('married')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('message')} name="message" rules={[{required: true, message: t('messages.required')}]}>
              <Input.TextArea rows={3} placeholder={t('empty')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={broadcastNotification?.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditQuestionGroup;
