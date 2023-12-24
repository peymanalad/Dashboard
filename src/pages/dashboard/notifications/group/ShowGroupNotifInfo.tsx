import React from 'react';
import {Card, Col, Divider, Row, Typography} from 'antd';
import {useFetch} from 'hooks';
import {get, isEmpty, join} from 'lodash';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {convertUtcTimeToLocal} from 'utils';

type Props = {};

const {Text, Title} = Typography;

const ShowGroupNotification = (props: Props) => {
  const {id} = useParams<any>();
  const {t} = useTranslation('notifications');
  const fetchNotification = useFetch({
    url: 'group_notifications/{id}',
    params: {id},
    enabled: true
  });

  return (
    <Card loading={fetchNotification.isFetching}>
      <Row className="mb-1">
        <Col>
          <Title level={5} className="mb-1">
            {t('title')}
          </Title>
          <Text>{fetchNotification?.data?.title}</Text>
        </Col>
      </Row>
      <Row className="mb-1">
        <Col>
          <Title level={5} className="mb-1">
            {t('message')}
          </Title>
          <Text>{fetchNotification?.data?.message}</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Title level={5} className="mb-1">
            {t('sender')}
          </Title>
          <Text>{get(fetchNotification?.data, ['sender', 'full_name'])}</Text>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5} className="mb-1">
            {t('created_at')}
          </Title>
          <Text>{convertUtcTimeToLocal(get(fetchNotification?.data, 'created_at'))}</Text>
        </Col>
      </Row>
      <Divider orientation="right">{t('filters')}</Divider>
      <Row className="mb-1">
        {get(fetchNotification?.data, ['meta', 'request', 'role']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('role')}
            </Title>
            <Text>{t(get(fetchNotification?.data, ['meta', 'request', 'role'])) || '-'}</Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'clinic']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('clinic')}
            </Title>
            <Text>{get(fetchNotification?.data, ['meta', 'request', 'clinic']) || '-'}</Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'doctor']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('doctor')}
            </Title>
            <Text>{get(fetchNotification?.data, ['meta', 'request', 'doctor']) || '-'}</Text>
          </Col>
        )}
      </Row>
      <Row className="mb-1">
        {!isEmpty(get(fetchNotification?.data, ['meta', 'request', 'diseases'])) && (
          <Col xs={24} md={12}>
            <Title level={5} className="mb-1">
              {t('diseases')}
            </Title>
            <Text>{join(get(fetchNotification?.data, ['meta', 'request', 'diseases'], ',')) || '-'}</Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'gender']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('gender')}
            </Title>
            <Text>{t(get(fetchNotification?.data, ['meta', 'request', 'gender'])) || '-'}</Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'martial_status']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('martial_status')}
            </Title>
            <Text>{t(get(fetchNotification?.data, ['meta', 'request', 'martial_status'])) || '-'}</Text>
          </Col>
        )}
      </Row>
      <Row>
        {get(fetchNotification?.data, ['meta', 'request', 'user_created_from']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('user_created_from')}
            </Title>
            <Text>
              {convertUtcTimeToLocal(get(fetchNotification?.data, ['meta', 'request', 'user_created_from'])) || '-'}
            </Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'user_created_to']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('user_created_to')}
            </Title>
            <Text>
              {convertUtcTimeToLocal(get(fetchNotification?.data, ['meta', 'request', 'user_created_to'])) || '-'}
            </Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'birthday_from']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('birthday_from')}
            </Title>
            <Text>
              {convertUtcTimeToLocal(get(fetchNotification?.data, ['meta', 'request', 'birthday_from'])) || '-'}
            </Text>
          </Col>
        )}
        {get(fetchNotification?.data, ['meta', 'request', 'birthday_to']) && (
          <Col xs={24} md={12} lg={8}>
            <Title level={5} className="mb-1">
              {t('birthday_to')}
            </Title>
            <Text>{get(fetchNotification?.data, ['meta', 'request', 'birthday_to']) || '-'}</Text>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default ShowGroupNotification;
