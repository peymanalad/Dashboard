import React, {FC, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Col, Card, Spin, Badge, Space, Typography, Image, Form} from 'antd';
import {
  PieChartOutlined,
  RiseOutlined,
  QuestionCircleOutlined,
  CommentOutlined,
  FolderOutlined,
  LikeOutlined,
  DollarCircleOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import {DashboardCountCard} from 'containers';
import moment from 'moment-jalaali';
import {LinkableListItem, Line, Pie, VerticalBar, StackBar, TreeMap} from 'components';
import {useFetch} from 'hooks';
import {dashboardDefaultList, dashboardDefaultChart, dashboardImage} from 'assets';
import {months} from 'assets';
import {convertUtcTimeToLocal} from 'utils';
import forEach from 'lodash/forEach';
import toNumber from 'lodash/toNumber';
import isUndefined from 'lodash/isUndefined';
import isNil from 'lodash/isNil';
import SelectOrganization from 'containers/organization/SelectOrganization';
import data from './data.json';

const {Text} = Typography;

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');

  const fetchDashboard = useFetch({
    url: '/dashboard',
    name: 'dashboard',
    isGeneral: true,
    staleTime: 10000,
    enabled: false
  });
  fetchDashboard.data = data;

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

  if (fetchDashboard?.isFetching)
    return (
      <Row justify="center" align="middle" className="min-h-75vh">
        <Spin tip={t('fetching_dashboard')} />
      </Row>
    );

  if (isNil(fetchDashboard?.data))
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
      <Row gutter={[8, 8]} className="w-full px-2 m-0">
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#FFC107"
            title={t('recommendations_send_count')}
            count={fetchDashboard?.data?.recommendations_send_count || 0}
            icon={<RiseOutlined className="text-3xl" style={{color: '#c99702'}} />}
            wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#be79df"
            title={t('multi_visit_patients_count')}
            count={`%${fetchDashboard?.data?.multi_visit_patients_percent || 0}`}
            icon={<PieChartOutlined className="text-3xl" style={{color: '#8100bf'}} />}
            wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#34b7c7"
            title={t('data_collected')}
            count={fetchDashboard?.data?.answers_count || 0}
            icon={<DatabaseOutlined className="text-3xl" style={{color: '#00a6bb'}} />}
            wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
            wrapperContent={calculateContent}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <DashboardCountCard
            color="#26a69a"
            title={t('feedback_recommendations')}
            count={fetchDashboard?.data?.feedback_recommendations_count || 0}
            icon={<LikeOutlined className="text-3xl" style={{color: '#019385'}} />}
            wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
            wrapperContent={calculateContent}
          />
        </Col>
      </Row>
      <Form layout="vertical" name="product" requiredMark={false} className="my-4">
        <Row gutter={[8, 8]} className="w-full px-2 m-0">
          <Col xs={24} md={12}>
            <Form.Item
              name="organization"
              label={t('organization')}
              rules={[{required: true, message: t('messages.required')}]}>
              <SelectOrganization />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[8, 8]} className="w-full px-2 m-0">
        <Col span={24}>
          <Card title={t('support_message_count_chart')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
            <Line
              data={
                isNil(fetchDashboard?.data?.support_message_count_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.support_message_count_chart
              }
              labelKey={isNil(fetchDashboard?.data?.support_message_count_chart) ? 'key' : 'date'}
              valueKey={isNil(fetchDashboard?.data?.support_message_count_chart) ? 'value' : 'count'}
              labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
              height="300px"
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('most_numerous_diseases')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg w-full">
            <Pie
              data={
                isNil(fetchDashboard?.data?.most_diseases_visits_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.most_diseases_visits_chart
              }
              labelKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'key' : 'name'}
              showValue
              valueKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'value' : 'percent'}
              height="347px"
              suffix="%"
              chartKey={t('disease')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('orderCount')} className="rounded-lg shadow-lg">
            <StackBar
              data={
                isNil(fetchDashboard?.data?.order_items_weekly_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.order_items_weekly_chart
              }
              valueKey={
                isNil(fetchDashboard?.data?.order_items_weekly_chart)
                  ? 'value'
                  : ['recommendations_count', 'tickets_count']
              }
              labelKey={isNil(fetchDashboard?.data?.order_items_weekly_chart) ? 'key' : 'date'}
              height="300px"
              showLegend
              labelConvertor={formatTime}
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t('orderCount')} className="rounded-lg shadow-lg my-4">
            <VerticalBar
              data={
                isNil(fetchDashboard?.data?.order_items_weekly_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.order_items_weekly_chart
              }
              valueKey={
                isNil(fetchDashboard?.data?.order_items_weekly_chart)
                  ? 'value'
                  : ['recommendations_count', 'tickets_count']
              }
              labelKey={isNil(fetchDashboard?.data?.order_items_weekly_chart) ? 'key' : 'date'}
              height="320px"
              showLegend
              labelConvertor={formatTime}
              chartKey={t('count')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('most_numerous_diseases')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg w-full">
            <TreeMap
              data={
                isNil(fetchDashboard?.data?.most_diseases_visits_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.most_diseases_visits_chart
              }
              labelKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'key' : 'name'}
              showValue
              valueKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'value' : 'percent'}
              height="300px"
              suffix="%"
              chartKey={t('disease')}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t('most_numerous_diseases')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg w-full">
            <Pie
              data={
                isNil(fetchDashboard?.data?.most_diseases_visits_chart)
                  ? dashboardDefaultChart
                  : fetchDashboard?.data?.most_diseases_visits_chart
              }
              labelKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'key' : 'name'}
              showValue
              valueKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'value' : 'percent'}
              height="300px"
              suffix="%"
              chartKey={t('disease')}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
