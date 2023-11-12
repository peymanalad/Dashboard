import React, {useRef, type ElementRef, type FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, FileExcelOutlined, FormOutlined, UserOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation, useParams} from 'react-router-dom';
import {CustomTable, Search, SearchButton} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {getTempFileUrl} from 'utils/file';
import {queryStringToObject} from 'utils';
import type {simplePermissionProps} from 'types/common';
import qs from 'qs';

const ShowList: FC = () => {
  const {t} = useTranslation('organization');
  const {id} = useParams<{id?: string}>();
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
      dataIndex: 'organizationName',
      key: 'organizationName',
      align: 'center'
    },
    {
      title: t('location'),
      dataIndex: 'organizationLocation',
      key: 'organizationLocation',
      align: 'center',
      sorter: false
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('showOrganizationUsers')}
      extra={
        <Space size="small">
          <Link to="/news/member/create">
            <Button className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset" icon={<FormOutlined />}>
              {t('addOrganization')}
            </Button>
          </Link>
        </Space>
      }>
      <CustomTable
        fetch="services/app/User/GetListOfOrganizations"
        query={{userId: id}}
        path=""
        dataName={['users', 'organizations', id]}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
