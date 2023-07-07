import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Spin, Space, Typography, Image} from 'antd';
import {Stimulsoft} from 'stimulsoft-dashboards-js/Scripts/stimulsoft.viewer';
import {useFetch} from 'hooks';
import {dashboardImage} from 'assets';
import isNil from 'lodash/isNil';

const {Text} = Typography;

const viewer = new Stimulsoft.Viewer.StiViewer(undefined, 'StiViewer', false);
const report = Stimulsoft.Report.StiReport.createNewDashboard();

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');

  useEffect(() => {
    Stimulsoft.Base.StiLicense.loadFromString(process.env.REACT_APP_STIMULSOFT_LICENCE_KEY!);
  }, []);

  const fetchDashboard = useFetch({
    url: 'https://api.ideed.ir/Dashboard/Js',
    name: 'dashboard',
    responseType: 'text',
    staleTime: 10000,
    enabled: true
  });

  useEffect(() => {
    if (fetchDashboard?.data) {
      report.load(fetchDashboard?.data);
      viewer.report = report;
      viewer.renderHtml('viewer');
    }
  }, [fetchDashboard?.data]);

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

  return <div id="viewer" className="App" />;
};

export default Dashboard;
