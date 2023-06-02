import {Card, Space, Button, Collapse, Typography, Row, Col, Form} from 'antd';
import {CollapseR as CollapseReport, DateTimePicker} from 'components';
import React, {FC, ReactElement} from 'react';
import {useTranslation} from 'react-i18next';

const UserReport: FC = () => {
  const {Title} = Typography;
  const {t} = useTranslation('user_report');

  const formBody: ReactElement = (
    <Row gutter={8} className="w-full">
      <Col span={8}>
        <Form.Item label={t('form.from')} name="from">
          <DateTimePicker isGregorian={false} timePicker />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label={t('form.to')} name="to">
          <DateTimePicker isGregorian={false} timePicker />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Card title={t('user_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseReport
          type="link"
          urlName="users_report_excel"
          url="users/report/excel"
          title={t('user_excel')}
          path="path"
        />
        <CollapseReport
          type="link"
          urlName="users_report_prescription_logs_excel"
          url="users/report/prescription_logs_excel"
          title={t('patient_medicine_excel')}
          path="path"
          formBody={formBody}
        />
        <Collapse>
          <Collapse.Panel
            header={
              <Title level={5} className="m-0">
                {t('user_report_table')}
              </Title>
            }
            key="table">
            <Row className="w-full">
              <Button type="primary" href="/user/report/table" className="w-full md:w-unset md:mx-auto">
                {t('view')}
              </Button>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </Space>
    </Card>
  );
};

export default UserReport;
