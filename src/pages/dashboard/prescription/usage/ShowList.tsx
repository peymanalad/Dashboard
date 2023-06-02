import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('prescription');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/prescription_usages/{id}',
    name: 'prescriptionUsages'
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
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, usage: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/prescription/usages/edit/${usage?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                type="text"
                onClick={() => {
                  deleteRequest.show(usage?.id);
                }}
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
      className="my-6"
      title={t('usage_title')}
      extra={
        <Space size="small">
          {hasPermission('prescription_usages.store') && (
            <Link to="/prescription/usages/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_usage')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="prescription_usages/paginate" dataName="prescriptionUsages" columns={columns} />
    </Card>
  );
};
export default ShowList;
