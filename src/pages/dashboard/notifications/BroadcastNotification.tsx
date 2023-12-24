import React from 'react';
import {Card, Row, Form, Col, Button, notification, Input} from 'antd';
import {usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {MultiSelectPaginate} from 'components';
import {SaveOutlined} from '@ant-design/icons';
import map from 'lodash/map';

const EditQuestionGroup = () => {
  const {t} = useTranslation('message');

  const [form] = Form.useForm();

  const broadcastNotification = usePost({
    url: '/services/app/Notification/CreateAlarm',
    method: 'POST',
    form
  });

  const onFinish = (values: any) => {
    broadcastNotification.post(values);
  };

  return (
    <Card className="my-6" title={t('broadcast_notification')}>
      <Form form={form} name="QuestionGroup" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          {/*<Col xs={24}>*/}
          {/*  <Form.Item label={t('user')} name="organizationUser">*/}
          {/*    <MultiSelectPaginate*/}
          {/*      mode="multiple"*/}
          {/*      urlName={['organization', 'groupMembers', 'all']}*/}
          {/*      url="services/app/GroupMembers/GetAll"*/}
          {/*      renderCustomLabel={(option) => {*/}
          {/*        return `${option?.firstName || ''} ${option?.lastName || ''} - ${option?.userName || ''} - ${*/}
          {/*          option?.organizationGroupGroupName || ''*/}
          {/*        }`;*/}
          {/*      }}*/}
          {/*      keyPath={['groupMember']}*/}
          {/*      keyValue="id"*/}
          {/*      keyLabel="memberPosition"*/}
          {/*      placeholder={t('all')}*/}
          {/*      showSearch*/}
          {/*      isGeneral*/}
          {/*      dropDownWith*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={24}>
            <Form.Item
              label={t('message')}
              name="message"
              rules={[
                {required: true, message: t('messages.required')},
                {max: 256, message: t('messages.maxLength')}
              ]}>
              <Input.TextArea rows={5} placeholder={t('empty')} />
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
