import {Card, Space} from 'antd';
import {CollapseR} from 'components';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {convertMiladiToShamsiiiYear} from 'utils';

const VisitReport: FC = () => {
  const {t} = useTranslation('visit');

  return (
    <Card title={t('visit:report.visit_report')}>
      <Space direction="vertical" size="middle" className="w-full">
        <CollapseR
          type="bar"
          url="visits/report/count_chart"
          urlName="visits_count_chart"
          title={t('report.count_chart')}
          height="300px"
          showLabel
          labelConvertor={convertMiladiToShamsiiiYear}
          chartKey={t('count')}
        />
        <CollapseR
          type="pie"
          labelKey="name"
          valueKey="count"
          url="visits/report/most_disease_chart"
          urlName="most_disease_chart"
          title={t('report.most_disease_chart')}
          height="400px"
          showLabel
          permission="visits.most_disease_chart"
          // showLegend={true}
        />
        <CollapseR
          type="bar"
          layout="horizontal"
          valueKey="count"
          labelKey="name"
          url="visits/report/frequent_doctor_chart"
          urlName="frequent_doctor_chart"
          title={t('report.frequent_doctor_chart')}
          showLabel={false}
          permission="visits.frequent_doctor_chart"
          chartKey={t('count')}
        />
        <CollapseR
          type="pie"
          labelKey="name"
          valueKey="count"
          url="visits/report/frequent_clinic_chart"
          urlName="frequent_clinic_chart"
          title={t('report.frequent_clinic_chart')}
          height="400px"
          showLabel={false}
          permission="visits.frequent_clinic_chart"
          showLegend
        />
        <CollapseR
          labelKey="name"
          valueKey="count"
          url=""
          title={t('report.highest_dose_drug_chart')}
          height="400px"
          showLabel={false}
          permission="visits.frequent_clinic_chart"
          showLegend
        />
      </Space>
    </Card>
  );
};

export default VisitReport;
