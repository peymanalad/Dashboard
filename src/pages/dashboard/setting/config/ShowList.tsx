import React, {useRef, ElementRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useDelete, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, DeleteOutlined, EditOutlined, FilterOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {SearchConfigsList} from 'containers';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchConfigsList>>(null);

  const deleteRequest = useDelete({
    url: '/configs/{id}',
    name: 'configs'
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
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('key'),
      dataIndex: 'key',
      key: 'key',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, config: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/setting/config/edit/${config?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
                onClick={() => deleteRequest.show(config)}
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
      title={t('config')}
      extra={
        <Space size="small">
          {hasPermission('configs.store') && (
            <Link to="/setting/config/new">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_config')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchConfigsList ref={searchRef} />
      <CustomTable fetch="configs/paginate" dataName="configs" columns={columns} />
    </Card>
  );
};

export default ShowList;
