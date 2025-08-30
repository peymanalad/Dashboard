import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Spin, Space, Typography, Image} from 'antd';
import {Stimulsoft, StiOptions} from 'stimulsoft-dashboards-js/Scripts/stimulsoft.viewer';
import {useFetch, useUser} from 'hooks';
import {dashboardImage} from 'assets';
import isNil from 'lodash/isNil';
import {windowProcess} from 'utils/process';

const {Text} = Typography;

const viewer = new Stimulsoft.Viewer.StiViewer(undefined, 'StiViewer', false);

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');
  const user = useUser();

  const fetchDashboard = useFetch({
    url: `${windowProcess('REACT_APP_BASE_URL')}/Dashboard/Js`,
    name: 'dashboard',
    responseType: 'text',
    staleTime: 10000,
    enabled: true
  });

  useEffect(() => {
    if (fetchDashboard?.data) {
      const report = Stimulsoft.Report.StiReport.createNewDashboard();
      StiOptions.WebServer.url = `${windowProcess('REACT_APP_BASE_URL')}/DataAdapters`;
      StiOptions.WebServer.encryptData = false;
      StiOptions.WebServer.checkDataAdaptersVersion = false;
      Stimulsoft.Base.StiLicense.loadFromString(windowProcess('REACT_APP_STIMULSOFT_LICENCE_KEY'));
      report.onBeginProcessData = function (args) {
        args.headers.push({key: 'Authorization', value: `Bearer ${user.access_token}`});
      };
      report.load(fetchDashboard?.data);
      viewer.report = report;
      //Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('../assets/fonts/ttf/IRANSans.ttf');
      //Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('../assets/fonts/ttf/IRANSans(FaNum)_Medium.ttf');
      viewer.renderHtml('dashboard-viewer');
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

  return <div id="dashboard-viewer" className="ltr" />;
};

export default Dashboard;
