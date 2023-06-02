import React, {FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FormOutlined, DeleteOutlined, EditOutlined, SafetyCertificateOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('permission');
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/roles/{id}',
    name: 'roles'
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, role: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/setting/role/edit/${role?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
                onClick={() => deleteRequest.show(role)}
              />
            </Tooltip>
          )}
          <Tooltip title={t('change-role')}>
            <Link to={`/setting/role/permission/edit/${role?.id}`}>
              <Button type="text" style={{color: '#10a500'}} icon={<SafetyCertificateOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];
  return (
    <Card
      title={t('role')}
      extra={
        hasPermission('roles.store') && (
          <Link to="/setting/role/new">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_role')}
            </Button>
          </Link>
        )
      }>
      <CustomTable fetch="roles/paginate" dataName="roles" columns={columns} />
    </Card>
  );
};
export default ShowList;
