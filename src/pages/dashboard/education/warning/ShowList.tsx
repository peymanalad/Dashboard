import React, {ElementRef, useRef} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Card, Tooltip, Space} from 'antd';
import {FilterOutlined, FileSearchOutlined, EyeOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {LowIcon, EducationIcon, DoctorIcon, ViewIcon} from 'assets';
import {SearchWarning} from 'containers';
import {userProps} from 'types/user';

const ShowList = () => {
  const {t} = useTranslation('warning');
  const searchRef = useRef<ElementRef<typeof SearchWarning>>(null);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('full_name'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.name
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime) : '-')
    },
    {
      title: t('specifications'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['sm'],
      render: (status: string) => (
        <Tooltip title={t(status)}>
          {status === 'not_enough_recommendation' && <LowIcon />}
          {status === 'not_set_education' && <EducationIcon />}
          {status === 'have_not_visit' && <DoctorIcon />}
          {status === 'seen_many_recommendation' && <ViewIcon />}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (permissions: any, warning: any) => (
        <Space size={2}>
          <Tooltip title={t('show_user')}>
            <Link to={`/user/show/${warning?.user?.id}`}>
              <Button type="text" icon={<EyeOutlined style={{color: '#f6830f'}} />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('show_visit')}>
            <Link to={`/visits/list?user_id=${warning?.user?.id}`}>
              <Button type="text" icon={<FileSearchOutlined style={{color: '#035aa6'}} />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      className="my-6"
      title={t('warnings')}
      extra={
        <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <SearchWarning ref={searchRef} />
      <CustomTable
        fetch="warnings/paginate"
        rowClassName={(warning: any) => `bg-warning-${warning?.status}`}
        dataName="warnings"
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
