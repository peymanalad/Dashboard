import React, {FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('products');
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/product_types/{id}',
    name: 'productTypes'
  });

  const columns: any = [
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
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
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, productGroup: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/product/group/edit/${productGroup?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(productGroup?.id)}
                type="text"
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
      title={t('group')}
      extra={
        hasPermission('products.store') && (
          <Link to="/product/group/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_product_type')}
            </Button>
          </Link>
        )
      }>
      <CustomTable
        fetch="product_types/paginate"
        dataName="productTypes"
        rowClassName={(productGroup) => `bg-${productGroup?.is_active === 1 ? 'active' : 'inactive'}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
