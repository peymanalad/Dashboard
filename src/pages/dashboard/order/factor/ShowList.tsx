import React, {ElementRef, FC, useRef} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Space, Card, Tooltip, Typography, Popover} from 'antd';
import {
  FilterOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  FormOutlined
} from '@ant-design/icons';
import {SearchFactor} from 'containers';
import {CustomTable} from 'components';
import {status} from 'types/factor';
import {useUser} from 'hooks';
import toString from 'lodash/toString';
import {userProps} from 'types/user';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('factor');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchFactor>>(null);

  const showPhoneNumber = (phone: any) => {
    return <div>{phone}</div>;
  };

  const columns = [
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
      render: (user: userProps) => (
        <Popover content={() => showPhoneNumber(user?.mobile)}>
          <Text>{user?.full_name || user?.username}</Text>
        </Popover>
      )
    },
    {
      title: t('doctor'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (user: userProps) => (
        <Popover content={() => showPhoneNumber(user?.mobile)}>
          <Text>{user?.full_name || user?.username}</Text>
        </Popover>
      )
    },
    {
      title: t('total_price'),
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'center',
      responsive: ['sm'],
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      align: 'center',
      responsive: ['md'],
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('final_price'),
      dataIndex: 'final_price',
      key: 'final_price',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => convertUtcTimeToLocal(dateTime)
    },
    {
      title: t('specifications'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: status) => (
        <Tooltip title={t(`status.${status || 'cardToCard'}`)}>
          {status === 'succeed' && <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />}
          {status === 'failed' && <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />}
          {status === 'pending' && <ClockCircleOutlined style={{color: '#ff8222', fontSize: 16}} />}
          {!status && <CreditCardOutlined style={{color: '#223fff', fontSize: 16}} />}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'actions',
      align: 'center',
      render: (permissions: {view: boolean}, factor: any) =>
        permissions?.view && (
          <Tooltip title={t('show')}>
            <Link to={`/order/factor/show/${factor?.id}`}>
              <Button type="text" style={{color: '#f6830f'}} icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
        )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('factors')}
      extra={
        <Space size="small">
          {hasPermission('coupons.store') && (
            <Link to="/order/factor/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('addFactor')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchFactor ref={searchRef} />
      <CustomTable
        fetch="orders/paginate"
        rowClassName={(factor: any) => `bg-status-${factor?.status}`}
        dataName="orders"
        columns={columns}
      />
    </Card>
  );
};
export default ShowList;
