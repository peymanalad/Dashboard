import React from 'react';
import {Avatar, Button, Card, Col, Row, Tabs, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams, Link} from 'react-router-dom';
import {useFetch} from 'hooks';
import ShowNewsLikedUsers from 'containers/news/show/ShowNewsLikedUsers';
import ShowNewsSeenUsers from 'containers/news/show/ShowNewsSeenUsers';
import ShowNewsComments from 'containers/news/show/ShowNewsComments';
import {getImageUrl} from 'utils';
import {FormOutlined} from '@ant-design/icons';

const {TabPane} = Tabs;
const {Text, Title, Paragraph} = Typography;

function ShowNews() {
  const {t} = useTranslation('news');
  const {id} = useParams<{id?: string}>();

  const fetchNews = useFetch({
    name: ['news', id],
    url: 'services/app/Posts/GetPostForEdit',
    query: {Id: id},
    enabled: !!id
  });

  return (
    <Card
      title={t('newsProfile')}
      bordered={false}
      className="w-full"
      loading={fetchNews?.isFetching}
      extra={
        <Link to={`/news/news/edit/${id}`}>
          <Button
            type="primary"
            className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
            icon={<FormOutlined />}>
            {t('edit_news')}
          </Button>
        </Link>
      }>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} sm={12} md={8}>
          <div className="flex flex-col justify-center align-center">
            <Avatar size={80} src={getImageUrl(fetchNews?.data?.post?.postFile)} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('title')}</Title>
            <Typography.Link href={fetchNews?.data?.post?.postRefLink} className="mb-2 w-full text-center">
              {fetchNews?.data?.post?.postTitle || ''}
            </Typography.Link>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('news_group')}</Title>
            <Text keyboard className="mb-2 w-full text-center">
              {fetchNews?.data?.postGroupPostGroupDescription}
            </Text>
          </div>
        </Col>
        <Col xs={24}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('context')}</Title>
            <Paragraph type="secondary" ellipsis={{rows: 3, expandable: false}} className="mb-2 w-full text-center">
              <blockquote>{fetchNews?.data?.post?.postCaption}</blockquote>
            </Paragraph>
          </div>
        </Col>
      </Row>
      <Tabs type="line" size="small" className="overflow-visible">
        <TabPane tab={t('likedUsers')} key="likedUsers">
          <ShowNewsLikedUsers id={id} />
        </TabPane>
        <TabPane tab={t('seenUsers')} key="seenUsers">
          <ShowNewsSeenUsers id={id} />
        </TabPane>
        <TabPane tab={t('comments')} key="comments">
          <ShowNewsComments id={id} />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default ShowNews;
