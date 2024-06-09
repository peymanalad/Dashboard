import React, {FC, ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Row, Col, Card, Spin, Badge, Space, Typography, Image} from 'antd';
import {FileOutlined, CommentOutlined, EyeOutlined, UserOutlined} from '@ant-design/icons';
import {DashboardCountCard} from 'containers';
import moment from 'moment-jalaali';
import {Line, Pie, VerticalBar, TreeMap} from 'components';
import {useFetch, useUser} from 'hooks';
import {dashboardDefaultChart, dashboardImage} from 'assets';
import {months} from 'assets';
import {convertUtcTimeToLocal} from 'utils';
import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import {transformOrganizationData, calculatePercentages} from 'utils/dashboard';
import {queryStringToObject} from 'utils/common';
import SelectOrganization from 'containers/organization/SelectOrganization';
// import data from './data.json';

const {Text} = Typography;

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');
  const location = useLocation<any>();
  const {isSuperUser} = useUser();
  const superUser = isSuperUser();
  const queryObject = queryStringToObject(location?.search);

  const fetchOrganizationDashboard = useFetch({
    name: ['Dashboard', 'GetOrganizationDashboardView'],
    url: '/services/app/Posts/GetOrganizationDashboardView',
    query: {organizationId: queryObject?.organization?.id ? queryObject?.organization?.id : undefined},
    enabled: true
  });

  const fetchSuperDashboard = useFetch({
    name: ['Dashboard', 'GetSuperUserDashboardView'],
    url: '/services/app/Posts/GetSuperUserDashboardView',
    enabled: superUser
  });

  const top5ViewCountPerDay = transformOrganizationData(fetchSuperDashboard?.data?.top5ViewCountPerDay);

  const top5PostCountPerDay = transformOrganizationData(fetchSuperDashboard?.data?.top5PostCountPerDay);

  const top5LikeCountPerDay = calculatePercentages(fetchSuperDashboard?.data?.top5LikeCountPerDay);

  const top5CommentCountPerDay = calculatePercentages(fetchSuperDashboard?.data?.top5CommentCountPerDay);

  const formatTime = (date: any) => `${moment(date, 'YYYY-MM-DD').format('jMM/jDD')}`;

  const convertDate = (date: any) => {
    let monthName: string = '';
    forEach(months, (i: any) => {
      if (i?.id == date) {
        monthName = i?.name;
      }
    });
    return monthName;
  };

  const calculateContent: ReactNode = (
    <Badge status="processing" text={t('calculating')} title={t('calculating')} size="small" className="font-bold" />
  );

  if (fetchOrganizationDashboard?.isFetching)
    return (
      <Row justify="center" align="middle" className="min-h-75vh">
        <Spin tip={t('fetching_dashboard')} />
      </Row>
    );

  if (isNil(fetchOrganizationDashboard?.data))
    return (
      <Row justify="center" align="middle" className="min-h-75vh">
        <Space direction="vertical" align="center">
          <Image src={dashboardImage} width={150} preview={false} />
          <Text strong>{t('empty_dashboard')}</Text>
        </Space>
      </Row>
    );

  return (
    <>
      {superUser && (
        <Row gutter={[8, 8]} className="w-full px-2 m-0">
          <Col span={24}>
            <SelectOrganization hasAll />
          </Col>
        </Row>
      )}
      <Row gutter={[8, 8]} className="w-full px-2 my-4">
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#FFC107"
            title={t('users_count')}
            count={fetchSuperDashboard?.data?.totalUserCount || fetchOrganizationDashboard?.data?.totalUserCount || 0}
            icon={<UserOutlined className="text-3xl" style={{color: '#c99702'}} />}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#be79df"
            title={t('news_count')}
            count={fetchSuperDashboard?.data?.totalPostCount || fetchOrganizationDashboard?.data?.totalPostCount || 0}
            icon={<FileOutlined className="text-3xl" style={{color: '#8100bf'}} />}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#34b7c7"
            title={t('comments_count')}
            count={
              fetchSuperDashboard?.data?.totalCommentCount || fetchOrganizationDashboard?.data?.totalCommentCount || 0
            }
            icon={<CommentOutlined className="text-3xl" style={{color: '#00a6bb'}} />}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#26a69a"
            title={t('views_count')}
            count={
              fetchSuperDashboard?.data?.totalPostViewCount || fetchOrganizationDashboard?.data?.totalPostViewCount || 0
            }
            icon={<EyeOutlined className="text-3xl" style={{color: '#019385'}} />}
            wrapperContent={calculateContent}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]} className="w-full px-2 m-0">
        <Col span={24}>
          <Card title={t('news_release_process')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
            <Line
              data={
                isNil(fetchOrganizationDashboard?.data?.postCountPerDay)
                  ? dashboardDefaultChart
                  : fetchOrganizationDashboard?.data?.postCountPerDay
              }
              labelKey={isNil(fetchOrganizationDashboard?.data?.postCountPerDay) ? 'key' : 'dateOfCount'}
              valueKey={isNil(fetchOrganizationDashboard?.data?.postCountPerDay) ? 'value' : 'count'}
              labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
              height="300px"
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t('views_histogram')} className="rounded-lg shadow-lg my-4">
            <VerticalBar
              data={
                isNil(fetchOrganizationDashboard?.data?.viewCountPerDay)
                  ? dashboardDefaultChart
                  : fetchOrganizationDashboard?.data?.viewCountPerDay
              }
              valueKey={isNil(fetchOrganizationDashboard?.data?.viewCountPerDay) ? 'value' : 'count'}
              labelKey={isNil(fetchOrganizationDashboard?.data?.viewCountPerDay) ? 'key' : 'dateOfCount'}
              height="320px"
              labelConvertor={formatTime}
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('comment_process')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
            <Line
              data={
                isNil(fetchOrganizationDashboard?.data?.commentCountPerDay)
                  ? dashboardDefaultChart
                  : fetchOrganizationDashboard?.data?.commentCountPerDay
              }
              labelKey={isNil(fetchOrganizationDashboard?.data?.commentCountPerDay) ? 'key' : 'dateOfCount'}
              valueKey={isNil(fetchOrganizationDashboard?.data?.commentCountPerDay) ? 'value' : 'count'}
              labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
              height="300px"
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('news_like_process')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
            <Line
              data={
                isNil(fetchOrganizationDashboard?.data?.likeCountPerDay)
                  ? dashboardDefaultChart
                  : fetchOrganizationDashboard?.data?.likeCountPerDay
              }
              labelKey={isNil(fetchOrganizationDashboard?.data?.likeCountPerDay) ? 'key' : 'dateOfCount'}
              valueKey={isNil(fetchOrganizationDashboard?.data?.likeCountPerDay) ? 'value' : 'count'}
              labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
              height="300px"
              chartKey={t('count')}
            />
          </Card>
        </Col>
      </Row>
      {superUser && (
        <Row gutter={[8, 8]} className="w-full px-2 mx-0 mt-3">
          <Col span={24}>
            <Card
              title={t('news_release_process_top_organizations')}
              bodyStyle={{padding: 0}}
              className="rounded-lg shadow-lg">
              <Line
                data={isNil(top5PostCountPerDay) ? dashboardDefaultChart : top5PostCountPerDay?.values}
                labelKey={isNil(top5PostCountPerDay) ? 'key' : 'dateOfCount'}
                valueKey={isNil(top5PostCountPerDay) ? 'value' : top5PostCountPerDay?.labels}
                labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
                showLegend
                height="300px"
                chartKey={t('count')}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title={t('views_histogram_top_organizations')} className="rounded-lg shadow-lg my-4">
              <VerticalBar
                data={isNil(top5ViewCountPerDay) ? dashboardDefaultChart : top5ViewCountPerDay?.values}
                valueKey={isNil(top5ViewCountPerDay) ? 'value' : top5ViewCountPerDay?.labels}
                labelKey={isNil(top5ViewCountPerDay) ? 'key' : 'dateOfCount'}
                height="320px"
                showLegend
                labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
                chartKey={t('count')}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={t('news_like_process_top_organizations')}
              bodyStyle={{padding: 0}}
              className="rounded-lg shadow-lg w-full">
              <TreeMap
                data={isNil(top5LikeCountPerDay) ? dashboardDefaultChart : top5LikeCountPerDay}
                labelKey={isNil(top5LikeCountPerDay) ? 'key' : 'name'}
                showValue
                valueKey={isNil(top5LikeCountPerDay) ? 'value' : 'percent'}
                height="300px"
                suffix="%"
                chartKey={t('news_like_process_top_organizations')}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={t('comment_process_top_organizations')}
              bodyStyle={{padding: 0}}
              className="rounded-lg shadow-lg w-full">
              <Pie
                data={isNil(top5CommentCountPerDay) ? dashboardDefaultChart : top5CommentCountPerDay}
                labelKey={isNil(top5CommentCountPerDay) ? 'key' : 'name'}
                showValue
                valueKey={isNil(top5CommentCountPerDay) ? 'value' : 'percent'}
                height="300px"
                suffix="%"
                chartKey={t('disease')}
              />
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Dashboard;
