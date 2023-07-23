import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';
import {queryStringToObject} from 'utils/common';
import {getTempFileUrl} from 'utils/file';

const ShowList: FC = () => {
  const {t} = useTranslation('organization');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/OrganizationGroups/GetOrganizationGroupToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/OrganizationGroups/Delete',
    name: 'organizationGroups',
    titleKey: 'organizationName'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: ['organizationGroup', 'id'],
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: ['organizationGroup', 'groupName'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, organizationGroup: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/organization/group/edit/${organizationGroup.organizationGroup?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() =>
                deleteRequest.show(organizationGroup.organizationGroup, {Id: organizationGroup.organizationGroup?.id})
              }
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
      title={t('organization_groups')}
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
            <Link to="/organization/group/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_organization_group')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="OrganizationNameFilter" />
      <CustomTable fetch="services/app/OrganizationGroups/GetAll" dataName="organizationGroups" columns={columns} />
    </Card>
  );
};

export default ShowList;
