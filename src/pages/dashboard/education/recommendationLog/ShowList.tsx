import React, {ElementRef, FC, useRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {CloseCircleOutlined, FileExcelOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {CustomTable} from 'components';
import {SearchRecommendationLog} from 'containers';
import {EmptyBoxIcon, LowIcon, DiseaseIcon} from 'assets';

const ShowList: FC = () => {
  const {t} = useTranslation('recommendation');
  const searchRef = useRef<ElementRef<typeof SearchRecommendationLog>>(null);

  const columns: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (value: any) => value?.username
    },
    {
      title: t('doctor'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (value: any) => value?.full_name
    },
    {
      title: t('disease'),
      dataIndex: 'disease',
      key: 'disease',
      align: 'center',
      render: (value: any) => value?.name
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['sm'],
      render: (value: any) => convertUtcTimeToLocal(value)
    },
    {
      title: t('specifications'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      responsive: ['md'],
      render: (type: string) => (
        <Tooltip title={t(type)}>
          {type === 'limit_recommendation' && <LowIcon />}
          {type === 'end_recommendation' && <EmptyBoxIcon />}
          {type === 'exclude_disease' && <DiseaseIcon />}
          {type === 'not_confirmed' && <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />}
        </Tooltip>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('logs')}
      extra={
        <Space size="small">
          <Button
            className="d-text-none md:d-text-unset ant-btn-success"
            type="primary"
            icon={<FileExcelOutlined />}
            danger>
            {t('report_section.get_Excel')}
          </Button>
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <CustomTable
        fetch="recommender_logs/paginate"
        dataName="recommenderLog"
        rowClassName={(record) => `bg-${record?.status}`}
        columns={columns}
      />
      <SearchRecommendationLog ref={searchRef} />
    </Card>
  );
};

export default ShowList;
