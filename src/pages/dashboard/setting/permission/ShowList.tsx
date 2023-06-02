import React, {FC, useRef, ElementRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {CustomTable, Search} from 'components';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FormOutlined, DeleteOutlined, EditOutlined, FilterOutlined} from '@ant-design/icons';
import {useDelete, useUser} from 'hooks';

const ShowList: FC = () => {
  const {t} = useTranslation('permission');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof Search>>(null);

  const deleteRequest = useDelete({
    url: '/permissions/{id}',
    name: 'permissions'
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
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, permission: any) => (
        <Space size={2}>
          <Tooltip title={t('edit')}>
            <Link to={`/setting/permission/edit/${permission?.id}`}>
              <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              type="text"
              icon={<DeleteOutlined style={{color: 'red'}} />}
              onClick={() => deleteRequest.show(permission)}
            />
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
      title={t('permission')}
      extra={
        <Space size="small">
          {hasPermission('permissions.store') && (
            <Link to="/setting/permission/new">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_permission')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="permissions/paginate" dataName="permissions" columns={columns} />
    </Card>
  );
};

export default ShowList;
