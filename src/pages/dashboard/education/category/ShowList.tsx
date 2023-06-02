import React, {FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('category');
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/categories/{id}',
    name: 'categories'
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
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, category: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/education/category/edit/${category.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(category)}
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
      title={t('category')}
      extra={
        hasPermission('categories.store') && (
          <Link to="/education/category/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_category')}
            </Button>
          </Link>
        )
      }>
      <CustomTable fetch="categories/paginate" dataName="categories" columns={columns} />
    </Card>
  );
};

export default ShowList;
