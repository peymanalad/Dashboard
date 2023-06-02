import React, {ElementRef, FC, useRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('nutritional');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof Search>>(null);

  const deleteRequest = useDelete({
    url: '/nutritional_values/{id}',
    name: 'nutritional_values'
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
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      responsive: ['sm'],
      render: (value: 1 | 0) => (
        <Tooltip title={value === 1 ? t('active') : t('inactive')}>
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
      render: (permissions: simplePermissionProps, nutritional: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/education/nutritional/edit/${nutritional.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(nutritional)}
                type="text"
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
      title={t('nutritional_value')}
      extra={
        <Space size="small">
          {hasPermission('nutritional_values.store') && (
            <Link to="/education/nutritional/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_nutritional_value')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable
        fetch="nutritional_values/paginate"
        dataName="nutritional_values"
        rowClassName={(record) => `bg-${record?.is_active}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
