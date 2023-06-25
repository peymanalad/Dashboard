import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Card, Col, Form, Input, Row} from 'antd';
import {useFetch, usePost} from 'hooks';
import {TagSelect} from 'components';
import {SaveOutlined} from '@ant-design/icons';

interface Props {
  id?: number | string;
}

const ContactInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');

  const [form] = Form.useForm();

  const contact = useFetch({
    name: ['user', id, 'contacts'],
    url: 'users/{id}/contacts',
    params: {id},
    enabled: true
  });

  const updateContact = usePost({
    url: 'users/{id}/contacts',
    method: 'POST',
    removeQueries: [['user', id, 'contacts']],
    form
  });

  const onFinish = (value: any) => {
    updateContact.post(value, {}, {id});
  };

  return (
    <Card title={t('access_info.label')} loading={contact.isFetching} bordered={false} className="w-full shadow-lg">
      <Form form={form} name="Contact" layout="vertical" requiredMark={false} className=" w-full" onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label={t('contact_info.website')}
              initialValue={contact?.data?.website}
              rules={[{type: 'url', message: t('contact_info.validation.url')}]}>
              <Input type="url" className="ltr-input" disabled={!contact?.data?.permissions?.website} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phones" label={t('contact_info.phones')} initialValue={contact?.data?.phones || []}>
              <TagSelect
                className="w-full ltr-input"
                disabled={contact?.data?.permissions?.phones === false}
                placeholder={t('contact_info.empty')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="fax" label={t('contact_info.fax')} initialValue={contact?.data?.fax}>
              <Input type="number" className="ltr-input" disabled={!contact?.data?.permissions?.fax} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="postal_code"
              label={t('contact_info.postal_code')}
              initialValue={contact?.data?.postal_code}
              rules={[{len: 10, message: t('contact_info.validation.postal_len')}]}>
              <Input
                className="ltr-input"
                minLength={10}
                maxLength={10}
                type="number"
                disabled={!contact?.data?.permissions?.postal_code}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateContact?.isLoading}
            icon={<SaveOutlined />}>
            {t('contact_info.save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default ContactInfo;
