import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useUser} from 'hooks';
import {CustomTable} from 'components';
import {Card, Space, Button, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, FormOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {simplePermissionProps} from 'types/common';
import toString from 'lodash/toString';

const ServiceView: FC = () => {
  const {t} = useTranslation('service');
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/services/{id}',
    name: 'services'
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      responsive: ['sm'],
      render: (type: string) => t(type)
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      responsive: ['sm'],
      render: (value: 1 | 0) => (
        <Tooltip title={t(value === 1 ? 'confirm.true' : 'confirm.false')}>
          {value === 1 ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, service: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/order/service/edit/${service.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(service)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('services')}
      extra={
        hasPermission('services.store') && (
          <Link to="/order/service/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_service')}
            </Button>
          </Link>
        )
      }>
      <CustomTable
        fetch="services/paginate"
        rowClassName={(service) => `bg-${service?.is_active === 1 ? 'active' : 'inactive'}`}
        dataName="services"
        columns={columns}
      />
    </Card>
  );
};

export default ServiceView;
