import React from 'react';
import {Avatar, Card, Col, Row, Tabs, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useFetch} from 'hooks';
import ShowUserOrganizations from 'containers/users/show/ShowUserOrganizations';
import ShowUserLikedNews from 'containers/users/show/ShowUserLikedNews';
import ShowUserLoginAttempts from 'containers/users/show/ShowUserLoginAttempts';
import ShowUserSeenNews from 'containers/users/show/ShowUserSeenNews';
import ShowUserComments from 'containers/users/show/ShowUserComments';
import ShowUserCommentLikes from 'containers/users/show/ShowUserCommentLikes';
import ShowUserNews from 'containers/users/show/ShowUserNews';
import {getImageUrl} from 'utils';

const {TabPane} = Tabs;
const {Text, Title, Paragraph, Link} = Typography;

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
    <Card title={t('newsProfile')} bordered={false} className="w-full" loading={fetchNews?.isFetching}>
      <Row gutter={[16, 8]} className="w-full">
        <Col xs={24} sm={12} md={8}>
          <div className="flex flex-col justify-center align-center">
            <Avatar size={80} src={getImageUrl(fetchNews?.data?.post?.postFile)} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="flex flex-col justify-center align-center">
            <Title level={5}>{t('title')}</Title>
            <Link href={fetchNews?.data?.post?.postRefLink} className="mb-2 w-full text-center">
              {fetchNews?.data?.post?.postTitle || ''}
            </Link>
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
      {/*<Tabs type="line" size="small" className="overflow-visible">*/}
      {/*  <TabPane tab={t('logins')} key="logins">*/}
      {/*    <ShowUserLoginAttempts id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('organizations')} key="users">*/}
      {/*    <ShowUserOrganizations id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('likedNews')} key="likedNews">*/}
      {/*    <ShowUserLikedNews id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('seenNews')} key="seenNews">*/}
      {/*    <ShowUserSeenNews id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('comments')} key="comments">*/}
      {/*    <ShowUserComments id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('commentLikes')} key="commentLikes">*/}
      {/*    <ShowUserCommentLikes id={id} />*/}
      {/*  </TabPane>*/}
      {/*  <TabPane tab={t('news')} key="news">*/}
      {/*    <ShowUserNews id={id} />*/}
      {/*  </TabPane>*/}
      {/*</Tabs>*/}
    </Card>
  );
}

export default ShowNews;
