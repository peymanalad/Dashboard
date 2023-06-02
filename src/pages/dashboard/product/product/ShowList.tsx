import React, {useRef, ElementRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useUser} from 'hooks';
import {CustomTable} from 'components';
import {Card, Space, Button, Tooltip} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {SearchProduct} from 'containers';
import {simplePermissionProps} from 'types/common';
import toString from 'lodash/toString';

const ProductView: FC = () => {
  const {t} = useTranslation('products');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchProduct>>(null);

  const deleteRequest = useDelete({
    url: '/products/{id}',
    name: 'products'
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
      title: t('provider_id'),
      dataIndex: 'provider_id',
      key: 'provider_id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('discount_percent'),
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      responsive: ['sm'],
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      responsive: ['sm'],
      render: (value: boolean) => (
        <Tooltip title={t(value ? 'confirm.true' : 'confirm.false')}>
          {value ? (
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
      render: (permissions: simplePermissionProps, product: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/product/product/edit/${product.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(product)}
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
      title={t('products')}
      extra={
        <Space size="small">
          {hasPermission('products.store') && (
            <Link to="/product/product/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_product')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchProduct ref={searchRef} />
      <CustomTable
        fetch="products/paginate"
        rowClassName={(product: any) => `bg-${product?.is_active ? 'active' : 'inactive'}`}
        dataName="products"
        columns={columns}
      />
    </Card>
  );
};

export default ProductView;
