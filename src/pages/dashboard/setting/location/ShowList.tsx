import React, {ElementRef, useRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useDelete, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, DeleteOutlined, EditOutlined, FilterOutlined} from '@ant-design/icons';
import {CustomTable, Search} from 'components';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/locations/{id}',
    name: 'locations'
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
      title: t('full_name'),
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, location: any) => (
        <Space size={2}>
          {permissions.update && (
            <Link to={`/setting/location/edit/${location?.id}`}>
              <Tooltip title={t('edit')}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Tooltip>
            </Link>
          )}
          {permissions.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
                onClick={() => deleteRequest.show(location)}
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
      title={t('location')}
      extra={
        <Space size="small">
          {hasPermission('location.store') && (
            <Link to="/setting/location/create">
              <Button type="primary" className="ant-btn-warning" icon={<FormOutlined />}>
                {t('add_location')}
              </Button>
            </Link>
          )}
          <Button type="primary" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="locations/paginate" dataName="locations" columns={columns} />
    </Card>
  );
};

export default ShowList;
