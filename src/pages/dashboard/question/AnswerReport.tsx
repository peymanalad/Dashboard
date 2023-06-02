import {Button, Card, Col, Collapse, Form, Row, Space, Spin, Typography} from 'antd';
import {CollapseR, DateTimePicker, Line, MultiSelectPaginate, Pie} from 'components';
import {useFetch} from 'hooks';
import {map} from 'lodash';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';

const {Title} = Typography;

const AnswerReport: FC = () => {
  const {t} = useTranslation('question');

  const getReport = useFetch({
    url: 'questions/report/report',
    name: 'questions_report_report'
  });

  const onFinish = (data: any) => {
    getReport.fetch({}, data);
  };

  return (
    <Card title={t('question:report.answer_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          type="line"
          labelKey="date"
          valueKey="count"
          url="answers/report/count_chart"
          urlName="count_chart"
          title={t('question:report.count_chart')}
          height="400px"
          chartKey={t('count')}
          //   dataFormatter={formatTime}
          permission="answers.count_chart"
        />
        <CollapseR
          type="line"
          labelKey="date"
          valueKey="count"
          url="answers/report/response_average_chart"
          urlName="response_average_chart"
          title={t('question:report.response_average_chart')}
          height="400px"
          chartKey={t('count')}
          //   dataFormatter={formatTime}
          permission="answers.count_chart"
        />
        <CollapseR
          type="bar"
          labelKey="name"
          valueKey="count"
          url="answers/report/most_tracked_diseases"
          urlName="most_tracked_diseases"
          title={t('question:report.most_tracked_diseases')}
          permission="answers.most_tracked_diseases"
          // height="400px"
        />

        <CollapseR
          type="number"
          labelKey="name"
          valueKey="count"
          url="answers/report/response_average"
          urlName="response_average"
          title={t('question:report.response_average')}
          height="200px"
          permission="answers.response_average"
        />
        <CollapseR
          type="link"
          url="questions/report/diseases_without_questions"
          urlName="diseases_without_questions"
          title={t('question:report.diseases_without_questions')}
          permission="questions.diseases_without_questions"
        />
        <CollapseR
          type="link"
          url="questions/report/disease_question"
          urlName="disease_question"
          title={t('question:report.disease_question')}
          permission="questions.disease_question"
        />
        <CollapseR
          type="bar"
          url="questions/report/frequent_group_chart"
          labelKey="title"
          valueKey="count"
          urlName="frequent_group_chart"
          title={t('question:report.frequent_group_chart')}
          height="400px"
          permission="questions.frequent_group_chart"
        />
        <CollapseR
          type="pie"
          url="questions/report/frequent_disease_chart"
          labelKey="name"
          valueKey="count"
          urlName="frequent_disease_chart"
          title={t('question:report.frequent_disease_chart')}
          showLabel
          height="400px"
          permission="questions.frequent_disease_chart"
        />
        <Collapse accordion>
          <Collapse.Panel
            header={
              <Title level={5} className="m-0">
                {t('answer_question_report')}
              </Title>
            }
            key={1}>
            <Form layout="vertical" onFinish={onFinish}>
              <Row gutter={8} className="w-full">
                <Col span={12}>
                  <Form.Item
                    name="question_id"
                    label={t('question')}
                    className="mb-1/2 label-p-0"
                    rules={[{required: t('required')}]}
                    getValueFromEvent={(e) => e.id}>
                    <MultiSelectPaginate
                      url="questions/paginate"
                      keyValue="id"
                      keyLabel="title"
                      urlName="questions"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="users_id"
                    label={t('patients')}
                    className="mb-1/2 label-p-0"
                    getValueFromEvent={(e) => map(e, 'id')}>
                    <MultiSelectPaginate
                      url="/users/patients"
                      mode="multiple"
                      keyValue="id"
                      keyLabel="full_name"
                      urlName="patients_list"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="clinics_id" label={t('clinics')} className="mb-1/2 label-p-0">
                    <MultiSelectPaginate
                      mode="multiple"
                      url="users/clinics"
                      keyValue="id"
                      keyLabel="name"
                      urlName="clinics"
                      isGeneral
                      showSearch
                      placeholder={t('all')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="doctor_id"
                    label={t('doctors')}
                    className="mb-1/2 label-p-0"
                    getValueFromEvent={(e) => map(e, 'id')}>
                    <MultiSelectPaginate
                      mode="multiple"
                      url="users/doctors"
                      keyValue="id"
                      keyLabel="name"
                      urlName="doctors"
                      isGeneral
                      showSearch
                      placeholder={t('all')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="from_date" label={t('from_date')} className="mb-1/2 label-p-0">
                    <DateTimePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="to_date" label={t('to_date')} className="mb-1/2 label-p-0">
                    <DateTimePicker />
                  </Form.Item>
                </Col>
                <Button type="primary" className="mr-auto mt-2" htmlType="submit" loading={getReport.isFetching}>
                  {t('submit')}
                </Button>
              </Row>
            </Form>
            {getReport?.isFetched &&
              (!getReport.isFetching ? (
                <>
                  {getReport?.data?.line && (
                    <Line
                      data={getReport?.data?.line}
                      height="350px"
                      labelKey="date"
                      valueKey="average"
                      labelConvertor={(val) => convertUtcTimeToLocal(val, 'jYY/jMM/jDD')}
                    />
                  )}
                  {getReport?.data?.pie && (
                    <Pie
                      data={getReport?.data?.pie}
                      height="350px"
                      labelKey="name"
                      valueKey="count"
                      labelConvertor={(val) => convertUtcTimeToLocal(val, 'jYY/jMM/jDD')}
                    />
                  )}
                </>
              ) : (
                <Spin />
              ))}
          </Collapse.Panel>
        </Collapse>
      </Space>
    </Card>
  );
};

export default AnswerReport;
