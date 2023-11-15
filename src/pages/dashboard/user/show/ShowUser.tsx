import React from 'react';
import {Avatar, Card, Col, Row, Tabs, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useFetch} from 'hooks';
import ShowUserOrganizations from 'containers/users/show/ShowUserOrganizations';
import ShowUserLikedNews from 'containers/users/show/ShowUserLikedNews';
import {getImageUrl} from 'utils';

const {TabPane} = Tabs;
const {Text, Title} = Typography;

function UserCreate() {
  const {t} = useTranslation('user_create');
  const {id} = useParams<{id?: string}>();

  const fetchUser = useFetch({
    url: 'services/app/User/GetUserForEdit',
    name: ['user', id],
    query: {Id: id},
    enabled: !!id
  });

  return (
    <Card title={t('profile')} bordered={false} className="w-full" loading={fetchUser?.isFetching}>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} sm={12} md={8} order={1}>
          <div className="flex flex-col justify-center align-center">
            <Avatar size={80} src={getImageUrl(fetchUser?.data?.profilePictureId)} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('username')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchUser?.data?.user?.userName}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('mobile')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchUser?.data?.user?.phoneNumber}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('first_name')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchUser?.data?.user?.name}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('last_name')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchUser?.data?.user?.surname}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} order={2}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('nationalId')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchUser?.data?.user?.nationalId}
            </Text>
          </div>
        </Col>
      </Row>
      <Tabs type="line" size="small" className="overflow-visible">
        <TabPane tab={t('organizations')} key="users">
          <ShowUserOrganizations id={id} />
        </TabPane>
        <TabPane tab={t('likedNews')} key="news">
          <ShowUserLikedNews id={id} />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default UserCreate;
