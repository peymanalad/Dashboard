import React from 'react';
import {Avatar, Card, Col, Row, Tabs, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useFetch} from 'hooks';
import ShowOrganizationUsers from 'containers/organization/show/ShowOrganizationUsers';
import ShowOrganizationNews from 'containers/organization/show/ShowOrganizationNews';
import {getImageUrl} from 'utils';

const {TabPane} = Tabs;
const {Text, Title} = Typography;

function UserCreate() {
  const {t} = useTranslation('organization');
  const {id} = useParams<{id?: string}>();

  const fetchOrganization = useFetch({
    name: ['organization', id],
    url: 'services/app/Organizations/GetOrganizationForEdit',
    query: {Id: id},
    enabled: !!id
  });

  return (
    <Card title={t('organizationProfile')} bordered={false} className="w-full" loading={fetchOrganization?.isFetching}>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} sm={12} md={8} order={1}>
          <div className="flex flex-col justify-center align-center">
            <Avatar size={80} src={getImageUrl(fetchOrganization?.data?.organization?.organizationLogo)} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('organizationName')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchOrganization?.data?.organization?.organizationName}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('organization_nationalId')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchOrganization?.data?.organization?.nationalId}
            </Text>
          </div>
        </Col>
      </Row>
      <Tabs type="line" size="small" className="overflow-visible">
        <TabPane tab={t('organizationUsers')} key="users">
          <ShowOrganizationUsers id={id} />
        </TabPane>
        <TabPane tab={t('organizationNews')} key="news">
          <ShowOrganizationNews id={id} />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default UserCreate;
