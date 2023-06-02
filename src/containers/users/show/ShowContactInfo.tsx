import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Col, Row} from 'antd';
import {useFetch} from 'hooks';

interface Props {
  id?: number | string;
}
const ContactInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');

  const fetchContact = useFetch({
    name: ['user', id, 'contacts'],
    url: 'users/{id}/contacts',
    params: {id},
    enabled: !!id
  });

  return (
    <Card
      title={t('contact_info.label')}
      bordered={false}
      className="w-full shadow-lg"
      loading={fetchContact?.isFetching}>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} md={12}>
          <div className="flex flex-col">
            <h1>{t('contact_info.website')}</h1>
            <p className="value-show-info">{fetchContact?.data?.website || '-'}</p>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex flex-col">
            <h1>{t('contact_info.phones')}</h1>
            <p className="value-show-info">{fetchContact?.data?.phones?.join(' ، ') || '-'}</p>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} md={12}>
          <div className="flex flex-col">
            <h1>{t('contact_info.fax')}</h1>
            <p className="value-show-info">{fetchContact?.data?.fax || '-'}</p>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex flex-col">
            <h1>{t('contact_info.postal_code')}</h1>
            <p className="value-show-info">{fetchContact?.data?.postal_code || '-'}</p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ContactInfo;
