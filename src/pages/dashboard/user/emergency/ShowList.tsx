import React, {useRef, ElementRef, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {EyeOutlined, FilterOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal} from 'utils';
import {SearchTemporary} from 'containers';
import {Link} from 'react-router-dom';
import {userProps} from 'types/user';

const ShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof SearchTemporary>>(null);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('username'),
      dataIndex: ['user', 'full_name'],
      key: 'full_name',
      align: 'center',
      render: (user: any) => user || '-'
    },
    {
      title: t('doctor'),
      dataIndex: ['doctor', 'full_name'],
      key: 'code',
      align: 'center',
      render: (user: any) => user || '-'
    },
    {
      title: t('reviewer'),
      dataIndex: ['reviewer', 'full_name'],
      key: 'reviewer',
      align: 'center',
      render: (review: userProps) => review || '-'
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (value: string) => convertUtcTimeToLocal(value)
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: {view: boolean}, answer: any) => (
        <Space size={2}>
          {permissions?.view && (
            <Tooltip title={t('view')}>
              <Link to={`view/${answer.id}`}>
                <Button type="text" icon={<EyeOutlined className="text-orange" />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('emergency_answers')}
      extra={
        <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <SearchTemporary ref={searchRef} />
      <CustomTable
        fetch="important_answers/paginate"
        // rowClassName={(temporary: any) => `bg-user-${temporary?.status}`}
        dataName="important_answers"
        columns={columns}
      />
    </Card>
  );
};
export default ShowList;
