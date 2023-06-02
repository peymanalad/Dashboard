import {Card, Col, Collapse, Form, Input, Row, Space, Typography} from 'antd';
import {CollapseR, DateTimePicker} from 'components';
import React, {FC, ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import {convertMiladiToShamsiiiYear} from 'utils';
import {useHistory} from 'react-router-dom';

const Reports: FC = () => {
  const {t} = useTranslation('reports');
  const history = useHistory();
  const formBody = (
    <Row gutter={8} className="w-full">
      <Col span={8}>
        <Form.Item label={t('form.start_at')} name="start_at" rules={[{required: true, message: t('form.required')}]}>
          <DateTimePicker timePicker />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label={t('form.end_at')} name="end_at" rules={[{required: true, message: t('form.required')}]}>
          <DateTimePicker timePicker />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label={t('form.cost')} name="cost" rules={[{required: true, message: t('form.required')}]}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  const apiForm: ReactElement = (
    <Row gutter={8} className="w-full">
      <Col span={8}>
        <Form.Item label={t('form.date')} name="date" rules={[{required: true, message: t('form.required')}]}>
          <DateTimePicker />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Card title={t('reports')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          type="bar"
          url="statistics/fetch"
          query={{key: 'care_app_install_chart'}}
          urlName="care_app_install_chart"
          title={t('care_app_install_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('install_count')}
          url="statistics/fetch"
          query={{key: 'pros_app_install_chart'}}
          urlName="pros_app_install_chart"
          title={t('pros_app_install_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'active_users_daily_chart'}}
          urlName="active_users_daily_chart"
          title={t('active_users_daily_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'active_users_weekly_chart'}}
          urlName="active_users_weekly_chart"
          title={t('active_users_weekly_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'active_users_monthly_chart'}}
          urlName="active_users_monthly_chart"
          title={t('active_users_monthly_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'retention_users_chart'}}
          urlName="retention_users_chart"
          title={t('retention_users_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'conversion_rate_chart'}}
          urlName="conversion_rate_chart"
          title={t('conversion_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'advertising_rate_chart'}}
          urlName="advertising_rate_chart"
          title={t('advertising_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('income')}
          url="statistics/fetch"
          query={{key: 'monthly_recurring_revenue_chart'}}
          urlName="monthly_recurring_revenue_chart"
          title={t('monthly_recurring_revenue_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel={false}
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('recommendation_count')}
          url="statistics/fetch"
          query={{key: 'recommendation_sent_chart'}}
          urlName="recommendation_sent_chart"
          title={t('recommendation_sent_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('income')}
          url="statistics/fetch"
          query={{key: 'average_revenue_per_user_chart'}}
          urlName="average_revenue_per_user_chart"
          title={t('average_revenue_per_user_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel={false}
          chartKey={t('count')}
        />
        <CollapseR
          type="number"
          url="statistics/fetch"
          query={{key: 'current_active_users_count'}}
          urlName="current_active_users_count"
          title={t('current_active_users_count')}
        />
        <CollapseR
          type="number"
          url="statistics/fetch"
          query={{key: 'total_active_users_count'}}
          urlName="total_active_users_count"
          title={t('total_active_users_count')}
        />
        <CollapseR
          type="number"
          url="statistics/fetch"
          query={{key: 'total_users_count'}}
          urlName="total_users_count"
          title={t('total_users_count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'answers_count_chart'}}
          urlName="answers_count_chart"
          title={t('answers_count_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={['total', 'churn', 'percent']}
          url="statistics/fetch"
          query={{key: 'churn_rate_chart'}}
          urlName="churn_rate_chart"
          title={t('churn_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          // showLabel
          chartKey={t('count')}
          showLegend
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('time')}
          url="statistics/fetch"
          query={{key: 'average_lifespan_of_customer_chart'}}
          urlName="average_lifespan_of_customer_chart"
          title={t('average_lifespan_of_customer_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('satisfaction_rate')}
          url="statistics/fetch"
          query={{key: 'service_satisfaction_rate_chart'}}
          urlName="service_satisfaction_rate_chart"
          title={t('service_satisfaction_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('satisfaction_rate')}
          url="statistics/fetch"
          query={{key: 'response_satisfaction_rate_chart'}}
          urlName="response_satisfaction_rate_chart"
          title={t('response_satisfaction_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('satisfaction_rate')}
          url="statistics/fetch"
          query={{key: 'support_satisfaction_rate_chart'}}
          urlName="support_satisfaction_rate_chart"
          title={t('support_satisfaction_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('cure_rate')}
          url="statistics/fetch"
          query={{key: 'patient_cure_rate_chart'}}
          urlName="patient_cure_rate_chart"
          title={t('patient_cure_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'feedback_recommendation_chart'}}
          urlName="feedback_recommendation_chart"
          title={t('feedback_recommendation_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          layout="horizontal"
          valueKey={[t('confirm_count'), t('not_confirm_count')]}
          url="statistics/fetch"
          query={{key: 'doctor_recommendation_chart'}}
          urlName="doctor_recommendation_chart"
          title={t('doctor_recommendation_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          showLegend
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'recommendation_created_by_doctor_chart'}}
          urlName="recommendation_created_by_doctor_chart"
          title={t('recommendation_created_by_doctor_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={[
            'archive',
            'edit',
            'final_confirmed',
            'first_check',
            'new',
            'not_confirmed',
            'recheck',
            'source_check',
            'sourcing'
          ]}
          layout="horizontal"
          url="statistics/fetch"
          query={{key: 'recommendation_status_chart'}}
          urlName="recommendation_status_chart"
          title={t('recommendation_status_chart')}
          labelConvertor={convertMiladiToShamsiiiYear}
          height="1300px"
          showLabel
          showLegend
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={['count', 'multi_visit_count']}
          url="statistics/fetch"
          query={{key: 'visit_chart'}}
          urlName="visit_chart"
          title={t('visit_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
          showLegend
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('user_count')}
          url="statistics/fetch"
          query={{key: 'did_not_know_recommendation_rate_chart'}}
          urlName="did_not_know_recommendation_rate_chart"
          title={t('did_not_know_recommendation_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        {/* <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('time')}
          url="statistics/fetch"
          query={{key: 'ticket_response_average_chart'}}
          urlName="ticket_response_average_chart"
          title={t('ticket_response_average_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        /> */}
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('time')}
          url="statistics/fetch"
          query={{key: 'support_response_average_chart'}}
          urlName="support_response_average_chart"
          title={t('support_response_average_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="number"
          url="statistics/fetch"
          query={{key: 'active_disease_count'}}
          urlName="active_disease_count"
          title={t('active_disease_count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('percent')}
          url="statistics/fetch"
          query={{key: 'multimedia_recommendation_rate_chart'}}
          urlName="multimedia_recommendation_rate_chart"
          title={t('multimedia_recommendation_rate_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        {/* <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'support_message_chart'}}
          urlName="support_message_chart"
          title={t('support_message_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        /> */}
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'clinics_count_chart'}}
          urlName="clinics_count_chart"
          title={t('clinics_count_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'doctors_count_chart'}}
          urlName="doctors_count_chart"
          title={t('doctors_count_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('activation_rate')}
          url="statistics/fetch"
          query={{key: 'activation_rate_chart'}}
          urlName="activation_rate_chart"
          title={t('activation_rate_chart')}
          height="500px"
          // dataFormatter={formatTime}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('value')}
          url="statistics/fetch"
          query={{key: 'life_time_value_chart'}}
          urlName="life_time_value_chart"
          title={t('life_time_value_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'api_analytics_chart'}}
          urlName="api_analytics_chart"
          title={t('api_analytics_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'api_analytics_average_chart'}}
          urlName="api_analytics_average_chart"
          title={t('api_analytics_average_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <CollapseR
          type="bar"
          url="locations/report/most_frequent"
          urlName="most_frequent"
          title={t('most_frequent_location')}
          height="800px"
          labelKey="name"
          valueKey="count"
          permission="locations.most_frequent"
        />
        <CollapseR
          type="number"
          url="users/report/customer_acquisition_cost"
          urlName="customer_acquisition_cost"
          title={t('customer_acquisition_cost')}
          formBody={formBody}
          permission="users.customer_acquisition_cost"
        />
        <CollapseR
          type="bar"
          layout="horizontal"
          title={t('api_analytics_fetch')}
          url="api_analytics/fetch"
          urlName="api_analytics_fetch"
          formBody={apiForm}
          valueKey="name"
          labelKey="count"
          showLabel={false}
          // value={['count', 'avg']}
          dateFormat="YYYY-MM-DD"
        />
        <CollapseR
          type="bar"
          labelKey="date"
          valueKey={t('count')}
          url="statistics/fetch"
          query={{key: 'notifications_count_chart'}}
          urlName="notifications_count_chart"
          title={t('notifications_count_chart')}
          height="500px"
          labelConvertor={convertMiladiToShamsiiiYear}
          showLabel
          chartKey={t('count')}
        />
        <Collapse onChange={() => history.push('/report/api')}>
          <Collapse.Panel header={<Typography.Title level={5}>{t('api_logs')}</Typography.Title>} key="table" />
        </Collapse>
      </Space>
    </Card>
  );
};

export default Reports;
