import React, {FC, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Col, Card, Spin, Badge, Space, Typography, Image} from 'antd';
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
import {LinkableListItem, Line, Pie, VerticalBar} from 'components';
import {useFetch} from 'hooks';
import {dashboardDefaultList, dashboardDefaultChart, dashboardImage} from 'assets';
import {months} from 'assets';
import {convertUtcTimeToLocal} from 'utils';
import forEach from 'lodash/forEach';
import toNumber from 'lodash/toNumber';
import isUndefined from 'lodash/isUndefined';
import isNil from 'lodash/isNil';

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
    <Row gutter={[8, 8]} className="w-full px-2 m-0">
      <Col xs={24} md={12} lg={6}>
        <DashboardCountCard
          title={t('earnings_lastYear')}
          link="/visits/list"
          color="#9f7700"
          count={toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString()}
          icon={<DollarCircleOutlined className="text-white" style={{fontSize: 25}} />}
          wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
          wrapperContent={calculateContent}
          outline
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <DashboardCountCard
          title={t('last_day_visit_count')}
          color="#70129d"
          link="/visits/list"
          count={fetchDashboard?.data?.last_day_visit_count}
          icon={<FolderOutlined className="text-white" style={{fontSize: 25}} />}
          wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
          wrapperContent={calculateContent}
          outline
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <DashboardCountCard
          link="/message/support/list"
          color="#005f6a"
          title={t('support_messages')}
          count={fetchDashboard?.data?.support_messages_count}
          icon={<QuestionCircleOutlined className="text-white" style={{fontSize: 25}} />}
          wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
          wrapperContent={calculateContent}
          outline
        />
      </Col>
      <Col xs={24} md={12} lg={6}>
        <DashboardCountCard
          link="/message/ticket/list"
          color="#b30c80"
          title={t('tickets_message')}
          count={fetchDashboard?.data?.tickets_messages_count}
          icon={<CommentOutlined className="text-white" style={{fontSize: 25}} />}
          wrapper={isUndefined(toNumber(fetchDashboard?.data?.annual_income)?.toLocaleString())}
          wrapperContent={calculateContent}
          outline
        />
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
      <Col xs={24} md={12}>
        <Card title={t('patient_satisfaction')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
          <Line
            data={
              isNil(fetchDashboard?.data?.satisfaction_patients_chart)
                ? dashboardDefaultChart
                : fetchDashboard?.data?.satisfaction_patients_chart
            }
            labelKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'key' : 'month'}
            valueKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'value' : 'percent'}
            labelConvertor={convertDate}
            height="300px"
            chartKey={t('count')}
          />
        </Card>
      </Col>
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
      <Col xs={24} md={12}>
        <Card title={t('ticket_response_average_chart')} bodyStyle={{padding: 0}} className="rounded-lg shadow-lg">
          <VerticalBar
            data={
              isNil(fetchDashboard?.data?.ticket_response_average_chart)
                ? dashboardDefaultChart
                : fetchDashboard?.data?.ticket_response_average_chart
            }
            labelKey={isNil(fetchDashboard?.data?.ticket_response_average_chart) ? 'key' : 'date'}
            valueKey={isNil(fetchDashboard?.data?.ticket_response_average_chart) ? 'value' : 'average'}
            labelConvertor={(date) => convertUtcTimeToLocal(date, 'jMM/jDD')}
            height="300px"
            chartKey={t('averageHour')}
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
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
      <Col span={24}>
        <Card title={t('patient_3_month_ago')} className="rounded-lg shadow-lg my-4">
          <VerticalBar
            data={
              isNil(fetchDashboard?.data?.last_patients_weekly_chart)
                ? dashboardDefaultChart
                : fetchDashboard?.data?.last_patients_weekly_chart
            }
            valueKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'value' : 'count'}
            labelKey={isNil(fetchDashboard?.data?.last_patients_weekly_chart) ? 'key' : 'date'}
            height="320px"
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
        <LinkableListItem
          title={t('newly_enrolled_patients')}
          label={isNil(fetchDashboard?.data?.last_patients_list) ? 'key' : [['full_name'], ['username']]}
          value={isNil(fetchDashboard?.data?.last_patients_list) ? 'value' : 'created_at'}
          list={
            isNil(fetchDashboard?.data?.last_patients_list)
              ? dashboardDefaultList
              : fetchDashboard?.data?.last_patients_list
          }
          url="/user/show/{id}"
          wrapper={isNil(fetchDashboard?.data?.last_patients_list)}
          wrapperContent={calculateContent}
          valueConvertor={convertUtcTimeToLocal}
        />
      </Col>
      <Col xs={24} md={12}>
        <LinkableListItem
          title={t('trackable_user_list')}
          label={isNil(fetchDashboard?.data?.important_answers_list) ? 'key' : ['full_name']}
          value={isNil(fetchDashboard?.data?.important_answers_list) ? 'value' : 'created_at'}
          url="/question/answer_detail/show/{answer_detail_id}"
          list={
            isNil(fetchDashboard?.data?.important_answers_list)
              ? dashboardDefaultList
              : fetchDashboard?.data?.important_answers_list
          }
          wrapper={isNil(fetchDashboard?.data?.important_answers_list)}
          wrapperContent={calculateContent}
          valueConvertor={convertUtcTimeToLocal}
        />
      </Col>
    </Row>
  );
};

export default Dashboard;
