import {Card, Space} from 'antd';
import {CollapseR} from 'components';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

const PrescriptionReport: FC = () => {
  const {t} = useTranslation('prescription');

  return (
    <Card title={t('report.prescription_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          type="number"
          url="prescriptions/report/have_picture_percent"
          urlName="have_picture_percent"
          title={t('report.have_picture_percent')}
          permission="prescriptions.have_picture_percent"
        />
        <CollapseR
          type="number"
          url="prescriptions/report/without_detail_percent"
          urlName="without_detail_percent"
          title={t('report.without_detail_percent')}
          permission="prescriptions.without_detail_percent"
        />
        <CollapseR
          type="bar"
          url="prescriptions/report/type_percent_chart"
          labelKey="title"
          valueKey="percent"
          urlName="type_percent_chart"
          title={t('report.type_percent_chart')}
          height="500px"
          permission="prescriptions.type_percent_chart"
          chartKey={t('percent')}
        />
      </Space>
    </Card>
  );
};

export default PrescriptionReport;
