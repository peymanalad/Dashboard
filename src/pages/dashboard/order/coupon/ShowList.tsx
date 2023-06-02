import React, {ElementRef, FC, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useUser} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import {CustomTable} from 'components';
import {Card, Space, Button, Tooltip, Modal, Typography} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DiffOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {SearchCoupon} from 'containers';
import {simplePermissionProps} from 'types/common';
import isEmpty from 'lodash/isEmpty';

const {Text} = Typography;

const CouponView: FC = () => {
  const {t} = useTranslation('service');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchCoupon>>(null);

  const [content, setContent] = useState<string | null>();

  const deleteRequest = useDelete({
    url: '/coupons/{id}',
    name: 'coupons'
  });

  const onClickShowContent = (detail: string) => {
    setContent(detail || '');
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
      align: 'center'
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('amount_used'),
      dataIndex: 'amount_used',
      key: 'amount_used',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('expired_at'),
      dataIndex: 'expired_at',
      key: 'expired_at',
      align: 'center',
      responsive: ['sm'],
      render: (value: string) => (value ? convertUtcTimeToLocal(value, 'jYYYY/jMM/jDD (HH:mm)') : '-')
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (value: boolean, item: any) => (
        <Space size={2}>
          <Tooltip title={t(value ? 'confirm.true' : 'confirm.false')}>
            {value ? (
              <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
            ) : (
              <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
            )}
          </Tooltip>
          {item?.description && item?.description?.length && (
            <Tooltip title={t('description')}>
              <Button
                type="text"
                icon={<DiffOutlined style={{color: '#625772'}} />}
                onClick={() => onClickShowContent(item?.description)}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, coupon: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/order/coupon/edit/${coupon.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(coupon)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
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
      title={t('coupons')}
      extra={
        <Space size="small">
          {hasPermission('coupons.store') && (
            <Link to="/order/coupon/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_coupon')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Modal
        title={t('description')}
        visible={!isEmpty(content)}
        onCancel={() => {
          setContent('');
        }}
        footer={null}>
        <Text>{content}</Text>
      </Modal>
      <SearchCoupon ref={searchRef} />
      <CustomTable
        fetch="coupons/paginate"
        rowClassName={(coupon) => `bg-${coupon?.is_active ? 'active' : 'inactive'}`}
        dataName="coupons"
        columns={columns}
      />
    </Card>
  );
};

export default CouponView;
