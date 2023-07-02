import React, {useRef, type ElementRef, type FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useUser} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('permission');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const columns: any = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('display_name'),
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'center'
    },
    {
      title: t('default'),
      dataIndex: 'isDefault',
      key: 'isDefault',
      align: 'center',
      responsive: ['sm'],
      render: (isDefault: boolean) => (
        <Tooltip title={t(isDefault ? 'is_default' : 'is_not_default')}>
          {isDefault ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('static'),
      dataIndex: 'isStatic',
      key: 'isStatic',
      align: 'center',
      responsive: ['sm'],
      render: (isStatic: boolean) => (
        <Tooltip title={t(isStatic ? 'is_static' : 'is_not_static')}>
          {isStatic ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('created_at'),
      dataIndex: 'creationTime',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, role: any) => (
        <Tooltip title={t('update')}>
          <Link to={`/setting/role/edit/${role?.id}`}>
            <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
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
      title={t('role')}
      extra={
        <Space size="small">
          {!hasPermission('organizations.store') && (
            <Link to="/setting/role/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_role')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="name" />
      <CustomTable fetch="services/app/Role/GetListOfRoles" dataName="roles" columns={columns} hasIndexColumn />
    </Card>
  );
};

export default ShowList;
