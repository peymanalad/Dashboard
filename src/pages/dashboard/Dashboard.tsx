import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Spin, Space, Typography, Image} from 'antd';
import {useFetch} from 'hooks';
import {dashboardImage} from 'assets';
import isNil from 'lodash/isNil';

const {Text} = Typography;

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');

  const fetchDashboard = useFetch({
    url: 'https://api.ideed.ir/Dashboard',
    name: 'dashboard',
    // responseType: 'blob',
    staleTime: 10000,
    enabled: true
  });

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
    <iframe
      id="inlineFrameExample"
      title="Inline Frame Example"
      width="100%"
      style={{height: '80vh'}}
      srcDoc={`<base href="https://api.ideed.ir">${fetchDashboard?.data}`}
      // src={URL.createObjectURL(fetchDashboard?.data)}
    />
  );
};

export default Dashboard;
