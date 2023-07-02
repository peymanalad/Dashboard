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
    <Row gutter={[8, 8]} className="w-full px-2 m-0">
      <iframe
        id="inlineFrameExample"
        title="Inline Frame Example"
        width="300"
        height="200"
        src="https://api.ideed.ir/Dashboard"
      />
    </Row>
  );
};

export default Dashboard;
