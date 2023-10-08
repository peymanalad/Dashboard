import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {getTempFileUrl} from 'utils/file';
import {queryStringToObject} from 'utils';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('organization');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/Organizations/GetOrganizationsToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/Organizations/Delete',
    name: 'organizations',
    titleKey: 'organizationName'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: ['organization', 'id'],
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: ['organization', 'organizationName'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, organization: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/organization/organization/edit/${organization.organization?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(organization.organization, {Id: organization.organization?.id})}
              type="text"
              icon={<DeleteOutlined className="text-red" />}
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
      title={t('title')}
      extra={
        <Space size="small">
          <Button
            className="ant-btn-success d-text-none md:d-text-unset"
            type="primary"
            icon={<FileExcelOutlined />}
            loading={fetchExcel.isLoading}
            onClick={() => {
              fetchExcel.post({}, queryStringToObject(location.search));
            }}>
            {t('excel')}
          </Button>
          {!hasPermission('organizations.store') && (
            <Link to="/organization/organization/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_organization')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="services/app/Organizations/GetAll" dataName="organizations" columns={columns} />
    </Card>
  );
};

export default ShowList;
