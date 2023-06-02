import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {SearchMedicine} from 'containers';
import {useDelete, useUser} from 'hooks';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('prescription');
  const searchRef = useRef<ElementRef<typeof SearchMedicine>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/prescriptions/{id}',
    name: 'prescriptions'
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
      title: t('type.title'),
      dataIndex: ['type', 'title'],
      key: 'type',
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, medicine: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/prescription/medicine/edit/${medicine?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(medicine)}
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
      className="my-6"
      title={t('prescription_listTitle')}
      extra={
        <Space size="small">
          {hasPermission('prescriptions.store') && (
            <Link to="/prescription/medicine/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_prescription')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchMedicine ref={searchRef} />
      <CustomTable fetch="prescriptions/paginate" dataName="prescriptions" columns={columns} />
    </Card>
  );
};

export default ShowList;
